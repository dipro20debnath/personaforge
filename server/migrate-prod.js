import pg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function migrateDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 PersonaForge Production Database Migration');
    console.log('=============================================\n');

    await client.connect();
    console.log('✅ Connected to PostgreSQL database\n');

    // Create all tables
    console.log('📊 Creating database tables...\n');

    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active'
      )`,

      // Profiles table
      `CREATE TABLE IF NOT EXISTS profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(255) DEFAULT '',
        bio TEXT DEFAULT '',
        avatar_url VARCHAR(500) DEFAULT '',
        locale VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        dob DATE,
        country VARCHAR(100) DEFAULT '',
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Assessments table
      `CREATE TABLE IF NOT EXISTS assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        openness DECIMAL(5,2) DEFAULT 0,
        conscientiousness DECIMAL(5,2) DEFAULT 0,
        extraversion DECIMAL(5,2) DEFAULT 0,
        agreeableness DECIMAL(5,2) DEFAULT 0,
        neuroticism DECIMAL(5,2) DEFAULT 0,
        responses JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Skills table
      `CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        self_level INTEGER DEFAULT 1,
        target_level INTEGER DEFAULT 5,
        world_avg DECIMAL(5,2) DEFAULT 3.0,
        evidence JSONB DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Goals table
      `CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT '',
        metric VARCHAR(255) DEFAULT '',
        target_value DECIMAL(10,2) DEFAULT 100,
        current_value DECIMAL(10,2) DEFAULT 0,
        due_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        category VARCHAR(100) DEFAULT 'personal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Goal milestones table
      `CREATE TABLE IF NOT EXISTS goal_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        due_at TIMESTAMP,
        done BOOLEAN DEFAULT FALSE
      )`,

      // Habits table
      `CREATE TABLE IF NOT EXISTS habits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        cadence VARCHAR(50) DEFAULT 'daily',
        icon VARCHAR(10) DEFAULT '✅',
        streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Habit check-ins table
      `CREATE TABLE IF NOT EXISTS habit_checkins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
        day DATE NOT NULL,
        done BOOLEAN DEFAULT TRUE,
        note TEXT DEFAULT ''
      )`,

      // Journal entries table
      `CREATE TABLE IF NOT EXISTS journal_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) DEFAULT '',
        content TEXT NOT NULL,
        mood VARCHAR(50) DEFAULT 'neutral',
        tags JSONB DEFAULT '[]',
        xp_earned INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Learning paths table
      `CREATE TABLE IF NOT EXISTS learning_paths (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT 'general',
        difficulty VARCHAR(50) DEFAULT 'beginner',
        resources JSONB DEFAULT '[]',
        duration_weeks INTEGER DEFAULT 4
      )`,

      // Learning enrollments table
      `CREATE TABLE IF NOT EXISTS learning_enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        path_id UUID REFERENCES learning_paths(id),
        progress DECIMAL(5,2) DEFAULT 0,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Notifications table
      `CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) DEFAULT 'info',
        title VARCHAR(255) NOT NULL,
        message TEXT DEFAULT '',
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Consent records table
      `CREATE TABLE IF NOT EXISTS consent_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        purpose VARCHAR(255) NOT NULL,
        granted BOOLEAN DEFAULT TRUE,
        ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Daily routines table
      `CREATE TABLE IF NOT EXISTS daily_routines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        routine JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Challenge progress table
      `CREATE TABLE IF NOT EXISTS challenge_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        day INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Daily quotes table
      `CREATE TABLE IF NOT EXISTS daily_quotes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        day INTEGER UNIQUE NOT NULL,
        quote TEXT NOT NULL,
        author VARCHAR(255) DEFAULT 'Unknown'
      )`,

      // Money entries table
      `CREATE TABLE IF NOT EXISTS money_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        description TEXT DEFAULT '',
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Voice commands table
      `CREATE TABLE IF NOT EXISTS voice_commands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        command VARCHAR(500) NOT NULL,
        response TEXT DEFAULT '',
        duration INTEGER DEFAULT 0,
        success BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Abroad goals table
      `CREATE TABLE IF NOT EXISTS abroad_goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        destination_country VARCHAR(255) NOT NULL,
        education_level VARCHAR(100) DEFAULT 'bachelors',
        study_field VARCHAR(255) DEFAULT '',
        intake_month VARCHAR(50) DEFAULT 'september',
        intake_year INTEGER DEFAULT 2025,
        progress INTEGER DEFAULT 0,
        visa_status VARCHAR(100) DEFAULT 'planning',
        days_until_intake INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Abroad requirements table
      `CREATE TABLE IF NOT EXISTS abroad_requirements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        goal_id UUID REFERENCES abroad_goals(id) ON DELETE CASCADE,
        requirement VARCHAR(500) NOT NULL,
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        deadline DATE
      )`,
    ];

    // Execute all table creation queries
    for (const query of queries) {
      try {
        await client.query(query);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.error('Error executing query:', error.message);
        }
      }
    }

    console.log('✅ All tables created/verified');
    console.log('');

    // Now create admin user
    console.log('👤 Creating admin user...\n');

    const email = 'dipro@gmail.com';
    const password = 'Ak472002#@';
    const userId = uuid();
    const hashedPassword = bcrypt.hashSync(password, 12);

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      const existingId = existingUser.rows[0].id;
      await client.query(
        'UPDATE users SET password = $1, role = $2 WHERE id = $3',
        [hashedPassword, 'admin', existingId]
      );
      console.log(`✅ Updated existing user to admin: ${email}`);
    } else {
      // Create new admin user
      await client.query(
        'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
        [userId, email, hashedPassword, 'admin']
      );
      console.log(`✅ Created new admin user: ${email}`);

      // Create profile for new user
      await client.query(
        'INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)',
        [userId, 'Admin']
      );
      console.log('✅ Created user profile');
    }

    console.log('\n✨ Admin Account Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log(`   Status: ACTIVE\n`);

    console.log('🚀 Database migration complete!');
    console.log('');
    console.log('You can now login at:');
    console.log('https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app\n');
    console.log('With credentials:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrateDatabase();
