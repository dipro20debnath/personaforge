import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:eQawlhEcnygFZGGivgtejkvOuOUSpvtp@yamabiko.proxy.rlwy.net:33958/railway'
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  locale TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  dob TEXT,
  country TEXT DEFAULT '',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  openness REAL DEFAULT 0,
  conscientiousness REAL DEFAULT 0,
  extraversion REAL DEFAULT 0,
  agreeableness REAL DEFAULT 0,
  neuroticism REAL DEFAULT 0,
  responses TEXT DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  self_level INTEGER DEFAULT 1,
  target_level INTEGER DEFAULT 5,
  world_avg REAL DEFAULT 3.0,
  evidence TEXT DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  metric TEXT DEFAULT '',
  target_value REAL DEFAULT 100,
  current_value REAL DEFAULT 0,
  due_at TEXT,
  status TEXT DEFAULT 'active',
  category TEXT DEFAULT 'personal',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goal_milestones (
  id TEXT PRIMARY KEY,
  goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at TEXT,
  done INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cadence TEXT DEFAULT 'daily',
  icon TEXT DEFAULT '✅',
  streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_checkins (
  id TEXT PRIMARY KEY,
  habit_id TEXT REFERENCES habits(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  done INTEGER DEFAULT 1,
  note TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  content TEXT NOT NULL,
  mood TEXT DEFAULT 'neutral',
  tags TEXT DEFAULT '[]',
  xp_earned INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  read INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

try {
  await client.connect();
  console.log('✅ Connected to production database');

  // Initialize schema
  console.log('📋 Initializing database schema...');
  await client.query(schema);
  console.log('✅ Schema created');

  // Create admin account
  const email = 'dipro@gmail.com';
  const password = 'Ak472002#@';
  const id = uuid();
  const hash = bcrypt.hashSync(password, 12);

  try {
    await client.query(
      'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
      [id, email, hash, 'admin']
    );
    console.log('✅ Admin account created!');
  } catch (e) {
    if (e.code === '23505') {
      await client.query(
        'UPDATE users SET role = $1, password = $2 WHERE email = $3',
        ['admin', hash, email]
      );
      console.log('✅ Updated existing account to admin');
    } else {
      throw e;
    }
  }

  // Verify
  const user = await client.query(
    'SELECT id, email, role FROM users WHERE email = $1',
    [email]
  );

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('Production Admin Account:');
  console.log('═══════════════════════════════════════');
  console.log('Email: ' + user.rows[0].email);
  console.log('Role: ' + user.rows[0].role);
  console.log('User ID: ' + user.rows[0].id);
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('✅ Production database is ready!');

  await client.end();
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}
