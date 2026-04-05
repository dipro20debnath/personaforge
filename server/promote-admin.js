import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'personaforge.db');

// Initialize and promote admin
async function promoteAdmin() {
  try {
    console.log('🔧 PersonaForge Admin Seeder');
    console.log('=============================\n');

    // Read current database
    const fileBuffer = readFileSync(DB_PATH);
    const SQL = await initSqlJs();
    const db = new SQL.Database(fileBuffer);

    // Get all users
    const users = db.exec('SELECT id, email, role FROM users');
    if (!users.length || !users[0].values.length) {
      console.log('❌ No users found in database');
      console.log('Please create an account first by registering on the app.\n');
      process.exit(0);
    }

    console.log('📋 Available Users:\n');
    users[0].values.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user[1]} (Current Role: ${user[2] || 'user'})`);
    });

    console.log('\n');

    // For development/demo: promote first user to admin
    const firstUser = users[0].values[0];
    const userId = firstUser[0];
    const email = firstUser[1];

    console.log(`✨ Promoting ${email} to ADMIN...\n`);

    // Update user role
    db.run('UPDATE users SET role = ? WHERE id = ?', ['admin', userId]);

    // Verify the change
    const updated = db.exec('SELECT email, role FROM users WHERE id = ?', [userId]);
    if (updated.length && updated[0].values.length) {
      const updatedUser = updated[0].values[0];
      console.log(`✅ Success! ${updatedUser[0]} is now an ADMIN (role: ${updatedUser[1]})\n`);
    }

    // Save to disk
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
    console.log('💾 Database saved!\n');

    console.log('🚀 Next Steps:');
    console.log('1. Start your application');
    console.log('2. Login with your account');
    console.log('3. Look for ⚙️ Administration in the sidebar');
    console.log('4. Click Admin Panel to access all admin features\n');

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

promoteAdmin();
