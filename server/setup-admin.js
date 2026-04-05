import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'personaforge.db');

async function setupAdminUser() {
  try {
    console.log('🔧 PersonaForge Admin Setup');
    console.log('=============================\n');

    const email = 'dipro@gmail.com';
    const password = 'Ak472002#@';

    // Read current database
    const fileBuffer = readFileSync(DB_PATH);
    const SQL = await initSqlJs();
    const db = new SQL.Database(fileBuffer);

    // Add role column if it doesn't exist
    try {
      db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
      console.log('✅ Added role column to users table');
    } catch (e) {
      // Column might already exist, that's okay
      if (!e.message.includes('duplicate column')) {
        throw e;
      }
    }

    // Check if user exists
    const existing = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    let userId;

    if (existing.length && existing[0].values.length) {
      // Update existing user
      userId = existing[0].values[0][0];
      const hashedPassword = bcrypt.hashSync(password, 12);
      db.run('UPDATE users SET password = ?, role = ? WHERE id = ?', [hashedPassword, 'admin', userId]);
      console.log(`✅ Updated existing user: ${email}`);
    } else {
      // Create new user
      userId = uuid();
      const hashedPassword = bcrypt.hashSync(password, 12);
      db.run('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', 
        [userId, email, hashedPassword, 'admin']);
      console.log(`✅ Created new admin user: ${email}`);

      // Create profile
      try {
        db.run('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)', 
          [userId, email.split('@')[0]]);
        console.log(`✅ Created user profile`);
      } catch (e) {
        // Profile might exist
      }
    }

    // Verify
    const verified = db.exec('SELECT email, role FROM users WHERE id = ?', [userId]);
    if (verified.length && verified[0].values.length) {
      const user = verified[0].values[0];
      console.log(`\n✨ Admin Account Details:`);
      console.log(`   Email: ${user[0]}`);
      console.log(`   Role: ${user[1]}`);
      console.log(`   Status: ACTIVE\n`);
    }

    // Save to disk
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
    console.log('💾 Database saved!\n');

    console.log('🚀 Next Steps:');
    console.log('1. Restart your application');
    console.log('2. Login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('3. You should see ⚙️ Administration in the sidebar');
    console.log('4. Click Admin Panel to access admin features\n');

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

setupAdminUser();
