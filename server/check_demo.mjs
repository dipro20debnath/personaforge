import initSqlJs from 'sql.js/dist/sql-wasm.js';
import { readFileSync } from 'fs';

const SQL = await initSqlJs({locateFile: f => './node_modules/sql.js/dist/' + f});
const buf = readFileSync('./personaforge.db');
const db = new SQL.Database(buf);

console.log('\n=== DATABASE VERIFICATION ===\n');

const users = db.exec("SELECT id, email FROM users WHERE email = 'demo@personaforge.com'");
if (users[0]?.values.length > 0) {
  console.log('✅ Demo User FOUND: demo@personaforge.com');
  console.log('   User ID:', users[0].values[0][0]);
} else {
  console.log('❌ Demo User NOT FOUND');
}

const profiles = db.exec("SELECT COUNT(*) as count FROM profiles");
console.log('✅ Total Profiles:', profiles[0]?.values[0][0] || 0);

const goals = db.exec("SELECT COUNT(*) as count FROM goals");
console.log('✅ Total Goals:', goals[0]?.values[0][0] || 0);

const habits = db.exec("SELECT COUNT(*) as count FROM habits");
console.log('✅ Total Habits:', habits[0]?.values[0][0] || 0);

const checkins = db.exec("SELECT COUNT(*) as count FROM habit_checkins");
console.log('✅ Habit Checkins:', checkins[0]?.values[0][0] || 0);

const entries = db.exec("SELECT COUNT(*) as count FROM journal_entries");
console.log('✅ Journal Entries:', entries[0]?.values[0][0] || 0);

const voice = db.exec("SELECT COUNT(*) as count FROM voice_commands");
console.log('✅ Voice Commands:', voice[0]?.values[0][0] || 0);

console.log('\n=== END VERIFICATION ===\n');
