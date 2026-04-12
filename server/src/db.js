import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pgPkg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'personaforge.db');
const { Client: PgClient } = pgPkg;

// Detect environment
const USE_POSTGRES = !!process.env.DATABASE_URL;
console.log(`[DB] Mode: ${USE_POSTGRES ? 'PostgreSQL' : 'SQLite'}`);

let db;

if (USE_POSTGRES) {
  // PostgreSQL mode
  const pgClient = new PgClient({
    connectionString: process.env.DATABASE_URL
  });

  class PostgresDatabase {
    constructor(client) {
      this.client = client;
      this._connected = false;
      this._connecting = null;  // Promise to track ongoing connection
    }

    async connect() {
      // If already connected, return immediately
      if (this._connected) return;
      
      // If connecting is in progress, wait for it
      if (this._connecting) return this._connecting;
      
      // Start the connection and store the promise
      this._connecting = (async () => {
        try {
          await this.client.connect();
          this._connected = true;
          console.log('[DB] Connected to PostgreSQL');
        } catch (e) {
          console.error('[DB] Connection failed:', e.message);
          this._connecting = null;  // Reset on failure
          throw e;
        }
      })();
      
      return this._connecting;
    }

    async exec(sql) {
      await this.connect();
      try {
        await this.client.query(sql);
      } catch (e) {
        console.error('[DB] exec error:', e.message);
      }
    }

    pragma(p) {
      // PostgreSQL doesn't need PRAGMA
    }

    prepare(sqlQuery) {
      const client = this.client;
      const connect = () => this.connect();

      return {
        run: (...params) => {
          return connect().then(async () => {
            try {
              const result = await client.query(sqlQuery, params);
              return { changes: result.rowCount };
            } catch (e) {
              console.error('[DB] run error:', e.message);
              throw e;
            }
          });
        },

        get: (...params) => {
          return connect().then(async () => {
            try {
              const result = await client.query(sqlQuery, params);
              return result.rows[0] || undefined;
            } catch (e) {
              console.error('[DB] get error:', e.message);
              throw e;
            }
          });
        },

        all: (...params) => {
          return connect().then(async () => {
            try {
              const result = await client.query(sqlQuery, params);
              return result.rows || [];
            } catch (e) {
              console.error('[DB] all error:', e.message);
              throw e;
            }
          });
        }
      };
    }

    transaction(fn) {
      return async (...args) => {
        await this.connect();
        await this.client.query('BEGIN');
        try {
          const result = await fn(...args);
          await this.client.query('COMMIT');
          return result;
        } catch (e) {
          await this.client.query('ROLLBACK');
          throw e;
        }
      };
    }
  }

  db = new PostgresDatabase(pgClient);
  // Don't pre-connect - let it connect on first use to avoid double-connection errors

} else {
  // SQLite mode (fallback for local development)
  class Database {
    constructor(sqlDb, dbPath) {
      this._db = sqlDb;
      this._path = dbPath;
    }

    _save() {
      try {
        const data = this._db.export();
        writeFileSync(this._path, Buffer.from(data));
      } catch (e) {
        console.error('[DB] Save error:', e.message);
      }
    }

    exec(sql) {
      this._db.exec(sql);
      this._save();
    }

    pragma(p) {
      try { this._db.exec('PRAGMA ' + p); } catch {}
    }

    prepare(sql) {
      const self = this;
      return {
        run(...params) {
          const safe = params.map(v => v === undefined ? null : v);
          self._db.run(sql, safe);
          self._save();
          return { changes: self._db.getRowsModified() };
        },
        get(...params) {
          const safe = params.map(v => v === undefined ? null : v);
          const stmt = self._db.prepare(sql);
          try {
            if (safe.length) stmt.bind(safe);
            if (stmt.step()) return stmt.getAsObject();
            return undefined;
          } finally { stmt.free(); }
        },
        all(...params) {
          const safe = params.map(v => v === undefined ? null : v);
          const stmt = self._db.prepare(sql);
          try {
            if (safe.length) stmt.bind(safe);
            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            return rows;
          } finally { stmt.free(); }
        },
      };
    }

    transaction(fn) {
      return (...args) => {
        try {
          const r = fn(...args);
          this._save();
          return r;
        } catch (e) {
          throw e;
        }
      };
    }
  }

  const SQL = await initSqlJs();
  let raw;
  if (existsSync(DB_PATH)) {
    try { raw = new SQL.Database(readFileSync(DB_PATH)); }
    catch { raw = new SQL.Database(); }
  } else {
    raw = new SQL.Database();
  }

  db = new Database(raw, DB_PATH);
  db.pragma('foreign_keys = ON');
}

/* ─── Schema ─── */
// Only create schema for SQLite - PostgreSQL handles this via migrate.js
if (!USE_POSTGRES) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now')),
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
    updated_at TEXT DEFAULT (datetime('now'))
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
    created_at TEXT DEFAULT (datetime('now'))
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
    updated_at TEXT DEFAULT (datetime('now'))
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
    created_at TEXT DEFAULT (datetime('now'))
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
    created_at TEXT DEFAULT (datetime('now'))
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
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS learning_paths (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT 'general',
    difficulty TEXT DEFAULT 'beginner',
    resources TEXT DEFAULT '[]',
    duration_weeks INTEGER DEFAULT 4
  );

  CREATE TABLE IF NOT EXISTS learning_enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    path_id TEXT REFERENCES learning_paths(id),
    progress REAL DEFAULT 0,
    enrolled_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT DEFAULT '',
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS consent_records (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    granted INTEGER DEFAULT 1,
    ts TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_routines (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    routine TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS challenge_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_quotes (
    id TEXT PRIMARY KEY,
    day INTEGER UNIQUE NOT NULL,
    quote TEXT NOT NULL,
    author TEXT DEFAULT 'Unknown'
  );

  CREATE TABLE IF NOT EXISTS money_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT DEFAULT '',
    date TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS voice_commands (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    command TEXT NOT NULL,
    response TEXT DEFAULT '',
    duration INTEGER DEFAULT 0,
    success INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS abroad_goals (
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
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS abroad_requirements (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    deadline TEXT DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS abroad_documents (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    expiry_date TEXT DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS abroad_skills (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    progress_level INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS abroad_timeline (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    milestone_type TEXT NOT NULL,
    milestone_date TEXT DEFAULT NULL,
    completed INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS abroad_expenses (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount REAL DEFAULT 0,
    paid_status TEXT DEFAULT 'planned'
  );

  CREATE TABLE IF NOT EXISTS abroad_mentor_notes (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES abroad_goals(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'general',
    note TEXT DEFAULT ''
  );
`);
} // End of if (!USE_POSTGRES) schema creation

// Only seed demo data in SQLite mode (PostgreSQL is seeded via migrations)
import bcryptjs from 'bcryptjs';

if (!USE_POSTGRES) {

/* ─── Seed 100 motivational quotes (only if table is empty) ─── */
const quoteCount = db.prepare('SELECT COUNT(*) as c FROM daily_quotes').get();
if (quoteCount.c === 0) {
  const insert = db.prepare('INSERT INTO daily_quotes (id, day, quote, author) VALUES (?, ?, ?, ?)');
  const { v4: uuid } = await import('uuid');
  
  const quotes = [
    [1, "You are worthy of love and respect exactly as you are.", "Brené Brown"],
    [2, "Self-love is not selfish; it is essential.", "Unknown"],
    [3, "You are enough, right here, right now.", "Lindo Bacon"],
    [4, "Your job is not to like yourself. It's to take care of yourself and then love who you become.", "Unknown"],
    [5, "Stop criticizing yourself for not being perfect. You are perfectly imperfect.", "Unknown"],
    [6, "Love yourself unconditionally, just as you would love your best friend.", "Unknown"],
    [7, "You deserve the same compassion you give to others.", "Unknown"],
    [8, "Healing begins when you choose yourself first.", "Thandeka"],
    [9, "Be your own biggest cheerleader. Celebrate yourself.", "Unknown"],
    [10, "You are not broken; you are evolving.", "Yoko Ono"],
    [11, "Your past is not your legacy; your growth is.", "Unknown"],
    [12, "I am becoming the best version of myself every single day.", "Unknown"],
    [13, "Self-care is not a luxury; it is a necessity.", "Poorna Bell"],
    [14, "Your body is not an apology. Your life is not an apology.", "Unknown"],
    [15, "Every mistake is a lesson wrapped in an opportunity.", "Unknown"],
    [16, "You are allowed to be a masterpiece and a work in progress simultaneously.", "Sophia Bush"],
    [17, "Stop waiting for permission to live your life.", "Unknown"],
    [18, "Your value is not determined by your productivity.", "Unknown"],
    [19, "You are brave for showing up every day and trying.", "Unknown"],
    [20, "Progress, not perfection, is the goal.", "Unknown"],
    [21, "I choose to see myself through eyes of love.", "Unknown"],
    [22, "Your dreams deserve your belief and action.", "Unknown"],
    [23, "You are allowed to be both a work in progress and worthy of love.", "Lindo Bacon"],
    [24, "Invest in yourself before investing in anyone else.", "Unknown"],
    [25, "Your worth is fixed. It cannot increase or decrease.", "Tasha Eurich"],
    [26, "Today, I choose joy and self-compassion.", "Unknown"],
    [27, "You deserve to feel comfortable in your own skin.", "Unknown"],
    [28, "Your past does not define your future.", "Unknown"],
    [29, "Loving yourself is the beginning of a lifelong romance.", "Oscar Wilde"],
    [30, "You are not too much; you are exactly enough.", "Unknown"],
    [31, "Your uniqueness is your superpower.", "Unknown"],
    [32, "I am proud of who I am becoming.", "Unknown"],
    [33, "You deserve to take up space in this world.", "Unknown"],
    [34, "Self-love is the foundation of all growth.", "Unknown"],
    [35, "You are braver than you believe, smarter than you seem, and stronger than you think.", "A.A. Milne"],
    [36, "Your story is not over; you are still writing it.", "Unknown"],
    [37, "Embrace your flaws; they make you human.", "Unknown"],
    [38, "You are allowed to outgrow people and situations.", "Unknown"],
    [39, "Your kindness to yourself will reflect in your kindness to others.", "Unknown"],
    [40, "Today, I choose growth over comfort.", "Unknown"],
    [41, "You deserve a life filled with meaning and joy.", "Unknown"],
    [42, "Your potential is limitless when you believe in yourself.", "Unknown"],
    [43, "Self-love is not narcissism; it is self-preservation.", "Unknown"],
    [44, "You are doing the best you can, and that is enough.", "Unknown"],
    [45, "Your challenges are your opportunities to grow stronger.", "Unknown"],
    [46, "I am grateful for who I am and excited about who I am becoming.", "Unknown"],
    [47, "Your voice matters; speak your truth.", "Unknown"],
    [48, "You deserve to be treated with kindness and respect—especially by yourself.", "Unknown"],
    [49, "Every day is a fresh start to love yourself more.", "Unknown"],
    [50, "Your dreams do not have an expiration date.", "Unknown"],
    [51, "You are not a burden; you are a blessing.", "Unknown"],
    [52, "Self-love is the most radical act of rebellion.", "Unknown"],
    [53, "Your worth is not dependent on what you accomplish.", "Unknown"],
    [54, "You are allowed to change your mind and change your path.", "Unknown"],
    [55, "Today, I celebrate how far I have come.", "Unknown"],
    [56, "Your body is home; treat it with love.", "Unknown"],
    [57, "You are deserving of success and happiness.", "Unknown"],
    [58, "Self-compassion is not weakness; it is strength.", "Kristin Neff"],
    [59, "You are not broken; you are beautifully unfinished.", "Unknown"],
    [60, "Your potential is infinite when you stop doubting yourself.", "Unknown"],
    [61, "I am learning to love the parts of myself I once rejected.", "Unknown"],
    [62, "You deserve to mourn what you lost and celebrate what you have.", "Unknown"],
    [63, "Your life is not a race; enjoy the journey.", "Unknown"],
    [64, "You are allowed to take time for yourself without guilt.", "Unknown"],
    [65, "Self-love is the greatest revolution.", "Unknown"],
    [66, "Your mistakes do not define you; your actions do.", "Unknown"],
    [67, "You are more capable than you realize.", "Unknown"],
    [68, "Today, I choose to see the beauty within myself.", "Unknown"],
    [69, "Your journey is unique, and that makes it beautiful.", "Unknown"],
    [70, "You deserve to feel safe in your own mind.", "Unknown"],
    [71, "Self-care is self-respect.", "Unknown"],
    [72, "You are not too sensitive; you are beautifully aware.", "Unknown"],
    [73, "Your existence is an act of love to the world.", "Unknown"],
    [74, "You are allowed to prioritize your well-being.", "Unknown"],
    [75, "I am proud of my resilience and my strength.", "Unknown"],
    [76, "Your relationships should inspire you to love yourself more, not less.", "Unknown"],
    [77, "You deserve to be celebrated, not just tolerated.", "Unknown"],
    [78, "Your authenticity is your power.", "Unknown"],
    [79, "You are not competing with anyone because you are incomparable.", "Unknown"],
    [80, "Today, I release perfectionism and embrace progress.", "Unknown"],
    [81, "Your healing begins when you love yourself first.", "Unknown"],
    [82, "You are deserving of your own time and attention.", "Unknown"],
    [83, "Self-love is the ultimate self-defense mechanism.", "Unknown"],
    [84, "You are not responsible for fixing anyone else.", "Unknown"],
    [85, "I am building a life I love, one day at a time.", "Unknown"],
    [86, "Your boundaries are not walls; they are protection.", "Unknown"],
    [87, "You are allowed to grieve and grow simultaneously.", "Unknown"],
    [88, "Your voice is powerful; use it.", "Unknown"],
    [89, "You deserve a love that is unconditional and real.", "Unknown"],
    [90, "Today, I choose to be my own biggest supporter.", "Unknown"],
    [91, "Your legacy is not what you own; it is who you inspire.", "Unknown"],
    [92, "You are allowed to change and evolve.", "Unknown"],
    [93, "Self-love is not selfish; it is sustainable.", "Unknown"],
    [94, "You are a warrior who deserves to wear her crown.", "Unknown"],
    [95, "Your future is not somewhere you arrive at; it is something you create.", "Unknown"],
    [96, "I am enough, I have always been enough, and I will always be enough.", "Unknown"],
    [97, "Your power lies in accepting yourself completely.", "Unknown"],
    [98, "You deserve to feel alive, truly alive, every single day.", "Unknown"],
    [99, "Today, I celebrate 99 days of choosing myself.", "Unknown"],
    [100, "I have become the person I needed to be. I love myself fiercely. Day 100 is my beginning.", "Unknown"],
  ];

  const run = db.transaction((items) => {
    for (const [day, quote, author] of items) {
      insert.run(uuid(), day, quote, author);
    }
  });
  run(quotes);
}

/* ─── Seed learning paths (only if table is empty) ─── */
const count = db.prepare('SELECT COUNT(*) as c FROM learning_paths').get();
if (count.c === 0) {
  const insert = db.prepare(
    'INSERT INTO learning_paths (id,title,description,category,difficulty,resources,duration_weeks) VALUES (?,?,?,?,?,?,?)'
  );
  const paths = [
    ['lp1','Communication Mastery','Master verbal & written communication','communication','beginner',JSON.stringify([
      {title:'TED Talk: How to speak so people listen',url:'https://www.youtube.com/watch?v=eIho2S0ZahI',type:'video'},
      {title:'Harvard Business Review: Communication',url:'https://hbr.org/topic/communication',type:'article'},
      {title:'Coursera: Improving Communication Skills',url:'https://www.coursera.org/learn/wharton-communication-skills',type:'course'},
    ]),6],
    ['lp2','Leadership & Management','Build leadership skills from ground up','leadership','intermediate',JSON.stringify([
      {title:'Simon Sinek: Start With Why',url:'https://www.youtube.com/watch?v=u4ZoJKF_VuA',type:'video'},
      {title:'MindTools: Leadership Skills',url:'https://www.mindtools.com/pages/main/newMN_LDR.htm',type:'article'},
      {title:'edX: Becoming an Effective Leader',url:'https://www.edx.org/learn/leadership',type:'course'},
    ]),8],
    ['lp3','Technical Skills: Web Development','Learn modern web development','technical','beginner',JSON.stringify([
      {title:'freeCodeCamp',url:'https://www.freecodecamp.org',type:'course'},
      {title:'MDN Web Docs',url:'https://developer.mozilla.org',type:'article'},
      {title:'The Odin Project',url:'https://www.theodinproject.com',type:'course'},
    ]),12],
    ['lp4','Emotional Intelligence','Develop your EQ for better relationships','personal','beginner',JSON.stringify([
      {title:'Daniel Goleman: Emotional Intelligence',url:'https://www.youtube.com/watch?v=Y7m9eNoB3NU',type:'video'},
      {title:'HelpGuide: Emotional Intelligence',url:'https://www.helpguide.org/articles/mental-health/emotional-intelligence-eq.htm',type:'article'},
      {title:'Coursera: Inspired Leadership Through EI',url:'https://www.coursera.org/learn/emotional-intelligence-leadership',type:'course'},
    ]),6],
    ['lp5','Financial Literacy','Master personal finance and investing','finance','beginner',JSON.stringify([
      {title:'Khan Academy: Personal Finance',url:'https://www.khanacademy.org/college-careers-more/personal-finance',type:'course'},
      {title:'Investopedia',url:'https://www.investopedia.com',type:'article'},
      {title:'The Plain Bagel (YouTube)',url:'https://www.youtube.com/@ThePlainBagel',type:'video'},
    ]),8],
    ['lp6','Public Speaking','Overcome fear and speak with confidence','communication','intermediate',JSON.stringify([
      {title:'Toastmasters Tips',url:'https://www.toastmasters.org/resources',type:'article'},
      {title:'TED: The Secret Structure of Great Talks',url:'https://www.youtube.com/watch?v=1nYFpuc2Umk',type:'video'},
      {title:'Udemy: Public Speaking Masterclass',url:'https://www.udemy.com/topic/public-speaking/',type:'course'},
    ]),4],
  ];
  const run = db.transaction((items) => { for (const i of items) insert.run(...i); });
  run(paths);
}

/* ─── Seed demo account (78% completed) ─── */

try {
  const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@personaforge.com');
  if (!existingDemo) {
    const { v4: uuid } = await import('uuid');
    
    // Create demo user
    const demoUserId = uuid();
    const hashedPassword = bcryptjs.hashSync('Demo@123', 10);
    db.prepare('INSERT INTO users (id, email, password, status) VALUES (?, ?, ?, ?)').run(demoUserId, 'demo@personaforge.com', hashedPassword, 'active');

    // Create profile (78% of fields: 7/9 fields filled)
    db.prepare('INSERT INTO profiles (user_id, display_name, bio, avatar_url, locale, timezone, dob, country, xp, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(demoUserId, 'Alex Johnson', 'Personal growth enthusiast | 100-day journey', 'https://i.pravatar.com/150?img=33', 'en', 'America/New_York', '1995-06-15', 'United States', 4850, 6);

    // Create assessment (personality profile data)
    db.prepare('INSERT INTO assessments (id, user_id, openness, conscientiousness, extraversion, agreeableness, neuroticism, responses) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(uuid(), demoUserId, 0.78, 0.85, 0.72, 0.81, 0.42, '{}');

    // Create goals (5 goals with varying completion)
    const goalIds = [];
    const goals = [
      { title: 'Run a Marathon', desc: 'Complete 42.195 km marathon race', metric: 'km', target: 42.195, current: 32.5, status: 'active' },
      { title: 'Learn Spanish', desc: 'Achieve B1 level Spanish fluency', metric: '%', target: 100, current: 65, status: 'active' },
      { title: 'Write a Book', desc: 'Complete and publish a 50k word novel', metric: '%', target: 100, current: 42, status: 'active' },
      { title: 'Meditate Daily', desc: '365 days of daily meditation practice', metric: 'days', target: 365, current: 278, status: 'active' },
      { title: 'Save $10K', desc: 'Build emergency fund of $10,000', metric: '$', target: 10000, current: 7850, status: 'active' },
    ];
    
    for (const goal of goals) {
      const goalId = uuid();
      goalIds.push(goalId);
      db.prepare('INSERT INTO goals (id, user_id, title, description, metric, target_value, current_value, status, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(goalId, demoUserId, goal.title, goal.desc, goal.metric, goal.target, goal.current, goal.status, 'personal');
    }

    // Create goal milestones
    db.prepare('INSERT INTO goal_milestones (id, goal_id, title, done) VALUES (?, ?, ?, ?)').run(uuid(), goalIds[0], 'Complete 10K', 1);
    db.prepare('INSERT INTO goal_milestones (id, goal_id, title, done) VALUES (?, ?, ?, ?)').run(uuid(), goalIds[0], 'Complete Half-Marathon', 1);
    db.prepare('INSERT INTO goal_milestones (id, goal_id, title, done) VALUES (?, ?, ?, ?)').run(uuid(), goalIds[0], 'Train with running club', 0);

    // Create habits (6 habits with varying streaks)
    const habitIds = [];
    const habits = [
      { title: 'Morning Meditation', cadence: 'daily', streak: 78, best: 150 },
      { title: 'Exercise', cadence: 'daily', streak: 45, best: 92 },
      { title: 'Read 30 minutes', cadence: 'daily', streak: 62, best: 120 },
      { title: 'Journal', cadence: 'daily', streak: 38, best: 45 },
      { title: 'Learn Spanish', cadence: 'daily', streak: 52, best: 89 },
      { title: 'Network (meet someone new)', cadence: 'weekly', streak: 12, best: 18 },
    ];

    for (const habit of habits) {
      const habitId = uuid();
      habitIds.push(habitId);
      db.prepare('INSERT INTO habits (id, user_id, title, cadence, streak, best_streak) VALUES (?, ?, ?, ?, ?, ?)').run(habitId, demoUserId, habit.title, habit.cadence, habit.streak, habit.best);
    }

    // Create habit checkins (last 30 days of data for first habit)
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = date.toISOString().split('T')[0];
      const done = Math.random() > 0.2 ? 1 : 0;
      db.prepare('INSERT INTO habit_checkins (id, habit_id, day, done) VALUES (?, ?, ?, ?)').run(uuid(), habitIds[0], day, done);
    }

    // Create journal entries (8 entries)
    const moods = ['happy', 'neutral', 'anxious', 'grateful', 'motivated', 'calm', 'focused', 'energized'];
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 4));
      db.prepare('INSERT INTO journal_entries (id, user_id, title, content, mood, xp_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuid(), demoUserId, 'Day ' + (i + 1) + ' Reflection', 'Today was a productive day. I made progress on my marathon training and completed my Spanish lesson. Feeling grateful for the opportunities I have. This journaling practice is really helping me reflect on my personal growth.', moods[i % moods.length], 10, date.toISOString());
    }

    // Create skills (7 skills developed)
    const skills = [
      { name: 'Running', category: 'fitness', self: 7, target: 9, world: 5 },
      { name: 'Spanish', category: 'language', self: 6, target: 9, world: 5 },
      { name: 'Meditation', category: 'wellness', self: 7, target: 8, world: 4 },
      { name: 'Leadership', category: 'professional', self: 7, target: 8, world: 5 },
      { name: 'Public Speaking', category: 'professional', self: 6, target: 8, world: 5 },
      { name: 'Writing', category: 'creative', self: 6, target: 8, world: 4 },
      { name: 'Financial Management', category: 'finance', self: 7, target: 9, world: 5 },
    ];

    for (const skill of skills) {
      db.prepare('INSERT INTO skills (id, user_id, name, category, self_level, target_level, world_avg) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuid(), demoUserId, skill.name, skill.category, skill.self, skill.target, skill.world);
    }

    // Enroll in learning paths (5 enrollments)
    const learningPaths = ['lp1', 'lp2', 'lp3', 'lp4', 'lp5'];
    const progresses = [0.85, 0.62, 0.45, 0.78, 0.68];
    for (let i = 0; i < 5; i++) {
      db.prepare('INSERT INTO learning_enrollments (id, user_id, path_id, progress) VALUES (?, ?, ?, ?)').run(uuid(), demoUserId, learningPaths[i], progresses[i]);
    }

    // Create daily routine (today's schedule)
    const routineData = [
      { time: '06:00', activity: 'Morning Meditation', done: true, category: 'Wellness' },
      { time: '06:30', activity: 'Exercise - Running', done: true, category: 'Fitness' },
      { time: '07:30', activity: 'Breakfast & Shower', done: true, category: 'Personal' },
      { time: '08:00', activity: 'Spanish Learning', done: true, category: 'Learning' },
      { time: '09:00', activity: 'Work - Project Planning', done: true, category: 'Work' },
      { time: '12:00', activity: 'Lunch Break', done: true, category: 'Personal' },
      { time: '13:00', activity: 'Work - Development', done: true, category: 'Work' },
      { time: '15:00', activity: 'Coffee Break & Journal', done: true, category: 'Personal' },
      { time: '15:30', activity: 'Work - Meetings', done: false, category: 'Work' },
      { time: '17:30', activity: 'Evening Reading', done: false, category: 'Learning' },
      { time: '19:00', activity: 'Dinner', done: false, category: 'Personal' },
    ];
    db.prepare('INSERT INTO daily_routines (id, user_id, routine) VALUES (?, ?, ?)').run(uuid(), demoUserId, JSON.stringify(routineData));

    // Create 100-day challenge progress (78 days completed)
    for (let day = 1; day <= 78; day++) {
      db.prepare('INSERT INTO challenge_progress (id, user_id, day, completed) VALUES (?, ?, ?, ?)').run(uuid(), demoUserId, day, 1);
    }

    // Create money entries (mixed income/expense/assets)
    const moneyEntries = [
      { type: 'income', category: 'Salary', amount: 5000, desc: 'Monthly salary' },
      { type: 'income', category: 'Freelance', amount: 800, desc: 'Website project' },
      { type: 'expense', category: 'Food', amount: 450, desc: 'Groceries and dining' },
      { type: 'expense', category: 'Transport', amount: 120, desc: 'Gas and parking' },
      { type: 'expense', category: 'Entertainment', amount: 75, desc: 'Movies and activities' },
      { type: 'expense', category: 'Utilities', amount: 180, desc: 'Electric and water' },
      { type: 'asset', category: 'Savings', amount: 7850, desc: 'Emergency fund' },
      { type: 'asset', category: 'Investments', amount: 12500, desc: 'Stock portfolio' },
      { type: 'liability', category: 'Credit Card', amount: 2400, desc: 'Credit card balance' },
    ];

    for (const entry of moneyEntries) {
      db.prepare('INSERT INTO money_entries (id, user_id, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)').run(uuid(), demoUserId, entry.type, entry.category, entry.amount, entry.desc);
    }

    // Create voice commands history (5 sample commands)
    const voiceCommands = [
      { command: 'show my stats', response: 'You have 5 active goals, 6 tracked habits, and 78% progress on your 100-day challenge.' },
      { command: 'daily quote', response: 'Self-love is the most radical act of rebellion. You are worthy of love and respect exactly as you are.' },
      { command: 'add income 500', response: 'Income of $500 recorded successfully!' },
      { command: 'show habits', response: 'You are tracking 6 habits with an average streak of 48 days.' },
      { command: 'my streak', response: 'Your best streak is 150 days for Morning Meditation.' },
    ];

    for (const cmd of voiceCommands) {
      db.prepare('INSERT INTO voice_commands (id, user_id, command, response, duration, success) VALUES (?, ?, ?, ?, ?, ?)').run(uuid(), demoUserId, cmd.command, cmd.response, Math.floor(Math.random() * 2000) + 500, 1);
    }

    // Create abroad goals (2 sample goals showing different stages)
    const abroadGoals = [
      { destination: 'Canada', level: 'masters', field: 'Computer Science', month: 'september', year: 2025, progress: 68, visa: 'in_progress' },
      { destination: 'Australia', level: 'bachelors', field: 'Business Administration', month: 'february', year: 2026, progress: 35, visa: 'planning' },
    ];

    const abroadGoalIds = [];
    for (const goal of abroadGoals) {
      const aggId = uuid();
      abroadGoalIds.push(aggId);
      const intakeDate = new Date(goal.year, new Date(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(goal.month)), 1);
      const daysUntil = Math.ceil((intakeDate - new Date()) / (1000 * 60 * 60 * 24));
      
      db.prepare('INSERT INTO abroad_goals (id, user_id, destination_country, education_level, study_field, intake_month, intake_year, progress, visa_status, days_until_intake) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        aggId, demoUserId, goal.destination, goal.level, goal.field, goal.month, goal.year, goal.progress, goal.visa, daysUntil
      );
    }

    // Add requirements for Canada goal (Master's)
    const canadaRequirements = [
      { requirement: 'IELTS Score (7.0+)', priority: 'high', status: 'completed', deadline: '2025-03-15' },
      { requirement: 'GRE Score (310+)', priority: 'high', status: 'in_progress', deadline: '2025-04-30' },
      { requirement: 'Undergraduate Transcripts', priority: 'high', status: 'completed', deadline: '2025-02-28' },
      { requirement: 'Statement of Purpose', priority: 'high', status: 'in_progress', deadline: '2025-05-15' },
      { requirement: 'Letters of Recommendation (3)', priority: 'high', status: 'pending', deadline: '2025-05-30' },
      { requirement: 'CV/Resume', priority: 'medium', status: 'completed', deadline: '2025-05-15' },
      { requirement: 'Bachelor Degree Completion', priority: 'high', status: 'completed', deadline: '2025-06-15' },
    ];

    for (const req of canadaRequirements) {
      db.prepare('INSERT INTO abroad_requirements (id, goal_id, requirement, priority, status, deadline) VALUES (?, ?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], req.requirement, req.priority, req.status, req.deadline);
    }

    // Add documents needed for Canada goal
    const canadaDocuments = [
      { type: 'Passport', status: 'completed', expiry: '2028-05-10' },
      { type: 'Birth Certificate', status: 'completed', expiry: null },
      { type: 'Academic Transcripts', status: 'in_progress', expiry: null },
      { type: 'IELTS Certificate', status: 'pending', expiry: '2027-06-15' },
      { type: 'GRE Scorecard', status: 'pending', expiry: null },
      { type: 'Recommendation Letters', status: 'pending', expiry: null },
      { type: 'Statement of Purpose', status: 'in_progress', expiry: null },
      { type: 'Medical Exam Report', status: 'pending', expiry: '2025-08-31' },
      { type: 'Police Clearance Certificate', status: 'pending', expiry: '2025-09-01' },
    ];

    for (const doc of canadaDocuments) {
      db.prepare('INSERT INTO abroad_documents (id, goal_id, document_type, status, expiry_date) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], doc.type, doc.status, doc.expiry);
    }

    // Add skills being developed for Canada goal
    const canadaSkills = [
      { skill: 'English Proficiency', category: 'language', level: 4 },
      { skill: 'IELTS Preparation', category: 'language', level: 4 },
      { skill: 'GRE Quantitative', category: 'aptitude', level: 3 },
      { skill: 'GRE Verbal', category: 'aptitude', level: 3 },
      { skill: 'Research Writing', category: 'academic', level: 3 },
      { skill: 'Advanced Mathematics', category: 'technical', level: 4 },
    ];

    for (const skill of canadaSkills) {
      db.prepare('INSERT INTO abroad_skills (id, goal_id, skill_name, category, progress_level) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], skill.skill, skill.category, skill.level);
    }

    // Add timeline milestones for Canada goal
    const canadaTimeline = [
      { type: 'IELTS Exam', date: '2025-03-15', completed: 1 },
      { type: 'GRE Exam', date: '2025-04-30', completed: 0 },
      { type: 'Submit Application', date: '2025-06-15', completed: 0 },
      { type: 'Receive Admission Decision', date: '2025-07-31', completed: 0 },
      { type: 'Secure Funding/Scholarship', date: '2025-08-15', completed: 0 },
      { type: 'Medical Exam', date: '2025-08-30', completed: 0 },
      { type: 'Apply for Study Permit', date: '2025-09-01', completed: 0 },
      { type: 'Receive Study Permit', date: '2025-09-10', completed: 0 },
    ];

    for (const milestone of canadaTimeline) {
      db.prepare('INSERT INTO abroad_timeline (id, goal_id, milestone_type, milestone_date, completed) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], milestone.type, milestone.date, milestone.completed);
    }

    // Add expenses for Canada goal
    const canadaExpenses = [
      { category: 'Tuition Fee', amount: 15000, type: 'planned' },
      { category: 'Living Expenses', amount: 12000, type: 'planned' },
      { category: 'Application Fees', amount: 450, type: 'paid' },
      { category: 'IELTS Exam', amount: 300, type: 'paid' },
      { category: 'GRE Exam', amount: 205, type: 'paid' },
      { category: 'Visa Processing', amount: 200, type: 'planned' },
      { category: 'Travel', amount: 2000, type: 'planned' },
      { category: 'Accommodation Deposit', amount: 3000, type: 'planned' },
    ];

    for (const exp of canadaExpenses) {
      db.prepare('INSERT INTO abroad_expenses (id, goal_id, category, amount, paid_status) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], exp.category, exp.amount, exp.type);
    }

    // Add mentor notes for Canada goal
    const canadaNotes = [
      { category: 'Visa Strategy', note: 'Apply for study permit after receiving admission letter. Check Canadian immigration website regularly for updated requirements.' },
      { category: 'Finance', note: 'Look into Canadian scholarships for international students. Consider part-time work allowed by study permit (20 hrs/week).' },
      { category: 'Skill Development', note: 'Focus on IELTS first (target 7.0+). GRE verbal score is also important. Start research for SOP early.' },
    ];

    for (const note of canadaNotes) {
      db.prepare('INSERT INTO abroad_mentor_notes (id, goal_id, category, note) VALUES (?, ?, ?, ?)').run(uuid(), abroadGoalIds[0], note.category, note.note);
    }

    // Add requirements for Australia goal (Bachelor's)
    const ausRequirements = [
      { requirement: 'IELTS Score (6.5+)', priority: 'high', status: 'pending', deadline: '2025-09-30' },
      { requirement: 'High School Transcripts', priority: 'high', status: 'completed', deadline: '2025-08-15' },
      { requirement: 'High School Diploma', priority: 'high', status: 'completed', deadline: '2025-08-15' },
      { requirement: 'Statement of Purpose', priority: 'medium', status: 'pending', deadline: '2025-10-15' },
      { requirement: 'Letters of Recommendation', priority: 'medium', status: 'pending', deadline: '2025-10-30' },
    ];

    for (const req of ausRequirements) {
      db.prepare('INSERT INTO abroad_requirements (id, goal_id, requirement, priority, status, deadline) VALUES (?, ?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[1], req.requirement, req.priority, req.status, req.deadline);
    }

    // Add documents for Australia goal
    const ausDocuments = [
      { type: 'Passport', status: 'completed', expiry: '2027-12-25' },
      { type: 'High School Certificates', status: 'completed', expiry: null },
      { type: 'IELTS Certificate', status: 'pending', expiry: '2027-11-15' },
      { type: 'Medical Exam Report', status: 'pending', expiry: '2026-02-28' },
      { type: 'Police Clearance', status: 'pending', expiry: '2026-02-28' },
    ];

    for (const doc of ausDocuments) {
      db.prepare('INSERT INTO abroad_documents (id, goal_id, document_type, status, expiry_date) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[1], doc.type, doc.status, doc.expiry);
    }

    // Add skills for Australia goal
    const ausSkills = [
      { skill: 'General English', category: 'language', level: 2 },
      { skill: 'IELTS Reading', category: 'language', level: 2 },
      { skill: 'Academic Writing', category: 'academic', level: 2 },
    ];

    for (const skill of ausSkills) {
      db.prepare('INSERT INTO abroad_skills (id, goal_id, skill_name, category, progress_level) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[1], skill.skill, skill.category, skill.level);
    }

    // Add timeline for Australia goal
    const ausTimeline = [
      { type: 'IELTS Exam', date: '2025-09-30', completed: 0 },
      { type: 'Submit Application', date: '2025-10-15', completed: 0 },
      { type: 'Receive Admission', date: '2025-12-01', completed: 0 },
      { type: 'Medical Exam', date: '2026-01-15', completed: 0 },
      { type: 'Apply for Student Visa', date: '2026-01-20', completed: 0 },
    ];

    for (const milestone of ausTimeline) {
      db.prepare('INSERT INTO abroad_timeline (id, goal_id, milestone_type, milestone_date, completed) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[1], milestone.type, milestone.date, milestone.completed);
    }

    // Add expenses for Australia goal
    const ausExpenses = [
      { category: 'Tuition Fee', amount: 18000, type: 'planned' },
      { category: 'Living Expenses', amount: 15000, type: 'planned' },
      { category: 'IELTS Exam', amount: 300, type: 'planned' },
      { category: 'Visa Fee', amount: 575, type: 'planned' },
      { category: 'Travel', amount: 1500, type: 'planned' },
    ];

    for (const exp of ausExpenses) {
      db.prepare('INSERT INTO abroad_expenses (id, goal_id, category, amount, paid_status) VALUES (?, ?, ?, ?, ?)').run(uuid(), abroadGoalIds[1], exp.category, exp.amount, exp.type);
    }

    console.log('✅ Demo account created successfully!');
    console.log('   📧 Email: demo@personaforge.com');
    console.log('   🔐 Password: Demo@123');
  }
} catch (error) {
  console.error('❌ Demo account creation failed:', error.message);
}

} // End of if (!USE_POSTGRES) seed data

/* save once on clean shutdown */
process.on('exit',    () => { try { db._save(); } catch {} });
process.on('SIGINT',  () => { db._save(); process.exit(); });
process.on('SIGTERM', () => { db._save(); process.exit(); });

export default db;
