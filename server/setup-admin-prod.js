import pg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function setupAdminUserProduction() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Railway PostgreSQL
  });

  try {
    console.log('🔧 PersonaForge Production Admin Setup');
    console.log('=======================================\n');

    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    const email = 'dipro@gmail.com';
    const password = 'Ak472002#@';

    // Check if user exists
    const checkResult = await client.query('SELECT id, role FROM users WHERE email = $1', [email]);

    if (checkResult.rows.length > 0) {
      // Update existing user
      const userId = checkResult.rows[0].id;
      const hashedPassword = bcrypt.hashSync(password, 12);
      
      await client.query(
        'UPDATE users SET password = $1, role = $2 WHERE id = $3',
        [hashedPassword, 'admin', userId]
      );
      
      console.log(`✅ Updated existing user to admin: ${email}`);
    } else {
      // Create new user
      const userId = uuid();
      const hashedPassword = bcrypt.hashSync(password, 12);

      await client.query(
        'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
        [userId, email, hashedPassword, 'admin']
      );

      console.log(`✅ Created new admin user: ${email}`);

      // Create profile
      await client.query(
        'INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)',
        [userId, 'Admin']
      );

      console.log(`✅ Created user profile`);
    }

    console.log('\n✨ Admin Account Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log(`   Status: ACTIVE\n`);

    console.log('🚀 You can now login at https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app');
    console.log('   with these credentials to access the admin panel.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupAdminUserProduction();
