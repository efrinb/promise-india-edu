import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// Tracks failed login attempts per IP address.
// Blocks an IP for 15 minutes after 5 consecutive failures.
// Note: This resets if the server restarts. For multi-server deployments,
// use a Redis-based solution like @upstash/ratelimit instead.
// ---------------------------------------------------------------------------
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}
const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 15 * 60 * 1000;  // block for 15 minutes

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return { allowed: true };

  // If currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  // If the window has expired, reset the record
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
  }
  loginAttempts.set(ip, record);
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Check rate limit before doing anything else
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${Math.ceil((rateCheck.retryAfterSeconds || 900) / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        active: true,
        profileImage: true,
      },
    });

    if (!admin) {
      // Small delay on failure to slow down automated tools
      await new Promise((r) => setTimeout(r, 500));
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!admin.active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, admin.password);
    if (!isValid) {
      // Small delay on failure to slow down automated tools
      await new Promise((r) => setTimeout(r, 500));
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Successful login — clear any recorded failed attempts for this IP
    clearAttempts(ip);

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Log login activity
    try {
      const userAgent = request.headers.get('user-agent') || 'unknown';
      await prisma.adminActivity.create({
        data: {
          adminId: admin.id,
          action: 'login',
          ipAddress: ip,
          userAgent,
        },
      });
    } catch (activityError) {
      // Don't fail login if activity logging fails
      console.error('Failed to log login activity:', activityError);
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        profileImage: admin.profileImage,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid input or server error' },
      { status: 400 }
    );
  }
}
