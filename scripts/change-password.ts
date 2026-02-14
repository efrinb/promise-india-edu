import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function changePassword() {
  console.log('=== Change Admin Password ===\n');

  const email = await question('Enter admin email: ');
  const newPassword = await question('Enter new password (min 8 characters): ');
  const confirmPassword = await question('Confirm new password: ');

  if (newPassword !== confirmPassword) {
    console.error(' Passwords do not match!');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error(' Password must be at least 8 characters!');
    process.exit(1);
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.error(' Admin not found!');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('\n Password changed successfully for:', email);
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

changePassword();