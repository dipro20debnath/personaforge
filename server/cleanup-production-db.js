import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:eQawlhEcnygFZGGivgtejkvOuOUSpvtp@yamabiko.proxy.rlwy.net:33958/railway'
});

try {
  await client.connect();
  console.log('✅ Connected to production database');

  // Drop all tables to clear corrupted schema
  console.log('🧹 Cleaning up corrupted tables...');
  await client.query(`
    DROP TABLE IF EXISTS abroad_requirements CASCADE;
    DROP TABLE IF EXISTS abroad_goals CASCADE;
    DROP TABLE IF EXISTS voice_commands CASCADE;
    DROP TABLE IF EXISTS money_entries CASCADE;
    DROP TABLE IF EXISTS daily_quotes CASCADE;
    DROP TABLE IF EXISTS challenge_progress CASCADE;
    DROP TABLE IF EXISTS daily_routines CASCADE;
    DROP TABLE IF EXISTS consent_records CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS learning_enrollments CASCADE;
    DROP TABLE IF EXISTS learning_paths CASCADE;
    DROP TABLE IF EXISTS journal_entries CASCADE;
    DROP TABLE IF EXISTS habit_checkins CASCADE;
    DROP TABLE IF EXISTS habits CASCADE;
    DROP TABLE IF EXISTS goal_milestones CASCADE;
    DROP TABLE IF EXISTS goals CASCADE;
    DROP TABLE IF EXISTS skills CASCADE;
    DROP TABLE IF EXISTS assessments CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);
  console.log('✅ Tables dropped');

  // Recreate schema with TEXT primary keys (not UUID)
  console.log('📋 Creating correct schema...');
  await client.query(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE profiles (
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

    CREATE TABLE assessments (
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

    CREATE TABLE skills (
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

    CREATE TABLE goals (
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

    CREATE TABLE goal_milestones (
      id TEXT PRIMARY KEY,
      goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      due_at TEXT,
      done INTEGER DEFAULT 0
    );

    CREATE TABLE habits (
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

    CREATE TABLE habit_checkins (
      id TEXT PRIMARY KEY,
      habit_id TEXT REFERENCES habits(id) ON DELETE CASCADE,
      day TEXT NOT NULL,
      done INTEGER DEFAULT 1,
      note TEXT DEFAULT ''
    );

    CREATE TABLE journal_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT '',
      content TEXT NOT NULL,
      mood TEXT DEFAULT 'neutral',
      tags TEXT DEFAULT '[]',
      xp_earned INTEGER DEFAULT 10,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE learning_paths (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'general',
      difficulty TEXT DEFAULT 'beginner',
      resources TEXT DEFAULT '[]',
      duration_weeks INTEGER DEFAULT 4
    );

    CREATE TABLE learning_enrollments (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      path_id TEXT REFERENCES learning_paths(id),
      progress REAL DEFAULT 0,
      enrolled_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'info',
      title TEXT NOT NULL,
      message TEXT DEFAULT '',
      read INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE consent_records (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL,
      granted INTEGER DEFAULT 1,
      ts TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE daily_routines (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      routine TEXT DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE challenge_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      day INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE daily_quotes (
      id TEXT PRIMARY KEY,
      day INTEGER UNIQUE NOT NULL,
      quote TEXT NOT NULL,
      author TEXT DEFAULT 'Unknown'
    );

    CREATE TABLE money_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT DEFAULT '',
      date TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE voice_commands (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      command TEXT NOT NULL,
      response TEXT DEFAULT '',
      duration INTEGER DEFAULT 0,
      success INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE abroad_goals (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      destination_country TEXT NOT NULL,
      education_level TEXT DEFAULT 'bachelors',
      study_field TEXT DEFAULT '',
      intake_month TEXT DEFAULT 'september',
      intake_year INTEGER DEFAULT 2025,
      progress INTEGER DEFAULT 0,
      visa_status TEXT DEFAULT 'planning',
      days_until_intake INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE abroad_requirements (
      id TEXT PRIMARY KEY,
      goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
      requirement TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      deadline TEXT DEFAULT NULL
    );
  `);
  console.log('✅ Schema created');

  // Create admin account
  const email = 'dipro@gmail.com';
  const password = 'Ak472002#@';
  const id = uuid();
  const hash = bcrypt.hashSync(password, 12);

  await client.query(
    'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
    [id, email, hash, 'admin']
  );
  console.log('✅ Admin account created!');

  // Verify
  const user = await client.query(
    'SELECT id, email, role FROM users WHERE email = $1',
    [email]
  );

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('✅ Production Database Fixed!');
  console.log('═══════════════════════════════════════');
  console.log('Admin Email: ' + user.rows[0].email);
  console.log('Admin Role: ' + user.rows[0].role);
  console.log('User ID: ' + user.rows[0].id);
  console.log('═══════════════════════════════════════');

  await client.end();
  process.exit(0);
} catch (e) {
  console.error('❌ Error:', e.message);
  await client.end();
  process.exit(1);
}
