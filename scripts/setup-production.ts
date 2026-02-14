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

async function setupProduction() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Promise India - Initial Setup             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // Check if any admin exists
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Existing admins:');
      
      const allAdmins = await prisma.admin.findMany({
        select: { email: true, name: true, role: true },
      });
      
      allAdmins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.role})`);
      });
      
      const confirm = await question('\nDo you want to create another admin? (yes/no): ');
      
      if (confirm.toLowerCase() !== 'yes') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }

    // Get super admin details
    console.log('\n--- Create Super Admin ---\n');
    const name = await question('Full Name: ');
    const email = await question('Email: ');
    const password = await question('Password (min 8 chars): ');
    const confirmPassword = await question('Confirm Password: ');

    if (password !== confirmPassword) {
      console.error('\n Passwords do not match!');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\n Password must be at least 8 characters!');
      process.exit(1);
    }

    // Check if email exists
    const emailExists = await prisma.admin.findUnique({
      where: { email },
    });

    if (emailExists) {
      console.error('\n Email already in use!');
      process.exit(1);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash(password, 10);
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
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);

    // Create default settings if none exist
    const settingsExist = await prisma.settings.findFirst();
    
    if (!settingsExist) {
      console.log('\n--- Initial Settings (Optional) ---');
      console.log('You can skip these and update later via admin panel\n');
      
      const adminEmail = await question('Admin Email for notifications (or press Enter to skip): ');
      const phone = await question('Contact Phone (or press Enter to skip): ');
      const address = await question('Office Address (or press Enter to skip): ');

      await prisma.settings.create({
        data: {
          adminEmail: adminEmail || email,
          phone: phone || null,
          address: address || null,
        },
      });

      console.log(' Settings created');
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('  ║  Setup Complete!                           ║');
    console.log('  ╚════════════════════════════════════════════╝');
    console.log('\n Next steps:');
    console.log('1. Start the server: npm run dev (or npm run start)');
    console.log('2. Login at: /admin/login');
    console.log('3. Update settings via Settings page');
    console.log('4. Add colleges via Colleges → Add New');
    console.log('5. IMPORTANT: Change your password in admin panel\n');
    console.log('   Save your credentials securely!\n');

  } catch (error) {
    console.error('\n Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

setupProduction();