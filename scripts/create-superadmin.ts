import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createSuperAdmin() {
  console.log('=== Create Super Admin ===\n');

  const name = await question('Enter admin name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter password (min 8 characters): ');
  const confirmPassword = await question('Confirm password: ');

  if (password !== confirmPassword) {
    console.error(' Passwords do not match!');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error(' Password must be at least 8 characters!');
    process.exit(1);
  }

  try {
    // Check if email already exists
    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.error(' Admin with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'super_admin',
        active: true,
      },
    });

    console.log('\n Super Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('\n Please save your credentials securely!');
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createSuperAdmin();