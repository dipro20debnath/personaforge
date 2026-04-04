import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const profile = db.prepare('SELECT p.*, u.email FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=?').get(req.userId);
  const latestAssessment = db.prepare('SELECT * FROM assessments WHERE user_id=? ORDER BY created_at DESC LIMIT 1').get(req.userId);
  const skills = db.prepare('SELECT * FROM skills WHERE user_id=?').all(req.userId);
  const goals = db.prepare('SELECT * FROM goals WHERE user_id=? AND status="active"').all(req.userId);
  const completedGoals = db.prepare('SELECT COUNT(*) as c FROM goals WHERE user_id=? AND status="completed"').get(req.userId);
  const habits = db.prepare('SELECT * FROM habits WHERE user_id=?').all(req.userId);
  const abroadGoals = db.prepare('SELECT * FROM abroad_goals WHERE user_id=? ORDER BY created_at DESC LIMIT 5').all(req.userId);
  const totalAbroadGoals = db.prepare('SELECT COUNT(*) as c FROM abroad_goals WHERE user_id=?').get(req.userId);
  const today = new Date().toISOString().split('T')[0];
  const habitsCompletedToday = habits.filter(h => {
    const checkin = db.prepare('SELECT * FROM habit_checkins WHERE habit_id=? AND day=?').get(h.id, today);
    return !!checkin;
  }).length;
  const journalCount = db.prepare('SELECT COUNT(*) as c FROM journal_entries WHERE user_id=?').get(req.userId);
  const recentJournal = db.prepare('SELECT * FROM journal_entries WHERE user_id=? ORDER BY created_at DESC LIMIT 3').all(req.userId);
  const streakTotal = habits.reduce((acc, h) => acc + h.streak, 0);
  const level = Math.floor((profile?.xp || 0) / 100) + 1;

  res.json({
    profile: { ...profile, level },
    personality: latestAssessment ? {
      openness: latestAssessment.openness,
      conscientiousness: latestAssessment.conscientiousness,
      extraversion: latestAssessment.extraversion,
      agreeableness: latestAssessment.agreeableness,
      neuroticism: latestAssessment.neuroticism,
    } : null,
    stats: {
      totalSkills: skills.length,
      activeGoals: goals.length,
      completedGoals: completedGoals.c,
      totalHabits: habits.length,
      habitsCompletedToday,
      journalEntries: journalCount.c,
      totalStreak: streakTotal,
      totalAbroadGoals: totalAbroadGoals.c,
      xp: profile?.xp || 0,
      level,
    },
    skills: skills.slice(0, 6).map(s => ({ ...s, evidence: JSON.parse(s.evidence || '[]') })),
    activeGoals: goals.slice(0, 5),
    abroadGoals: abroadGoals,
    recentJournal: recentJournal.map(e => ({ ...e, tags: JSON.parse(e.tags || '[]') })),
  });
});

export default router;
