import express from 'express';
import db from '../db.js';
import { v4 as uuid } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * ═══════════════════════════════════════════════════════════════
 *  ABROAD GOAL ENDPOINTS
 *  Comprehensive system for planning and tracking abroad studies
 * ═══════════════════════════════════════════════════════════════
 */

/* ─── CRUD: Abroad Goals ─── */
router.post('/create', (req, res) => {
  try {
    const { destination, educationLevel, intakeMonth, intakeYear, studyField } = req.body;
    const userId = req.userId;
    
    console.log('🔍 Create abroad goal request:');
    console.log('   userId:', userId);
    console.log('   destination:', destination);
    console.log('   studyField:', studyField);
    console.log('   educationLevel:', educationLevel);
    console.log('   intakeMonth:', intakeMonth);
    console.log('   intakeYear:', intakeYear);
    
    if (!userId) {
      console.error('❌ No userId in request - auth middleware may have failed');
      return res.status(401).json({ error: 'Authentication failed: No user ID' });
    }
    
    if (!destination || !studyField) {
      return res.status(400).json({ error: 'Destination and study field are required' });
    }

    const goalId = uuid();
    const monthIndex = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(intakeMonth);
    const intakeDate = new Date(intakeYear, monthIndex, 1);
    const daysUntilIntake = Math.ceil((intakeDate - new Date()) / (1000 * 60 * 60 * 24));
    
    console.log('📅 Calculated dates:');
    console.log('   intakeDate:', intakeDate);
    console.log('   daysUntilIntake:', daysUntilIntake);
    console.log('   goalId:', goalId);
    
    const stmt = db.prepare('INSERT INTO abroad_goals (id, user_id, destination_country, education_level, study_field, intake_month, intake_year, days_until_intake) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(goalId, userId, destination, educationLevel || 'bachelors', studyField, intakeMonth || 'september', intakeYear || 2025, daysUntilIntake);
    
    console.log('✅ Goal created successfully:', result);
    res.json({ id: goalId, message: 'Abroad goal created successfully!' });
  } catch (err) {
    console.error('❌ Create abroad goal error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    const userId = req.userId;
    console.log('🔍 Fetching goals for userId:', userId);
    
    const goals = db.prepare('SELECT * FROM abroad_goals WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    console.log('📊 Found', goals.length, 'goals');
    console.log('Goals:', goals);
    
    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => {
      const requirements = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed FROM abroad_requirements WHERE goal_id = ?').get('completed', goal.id);
      const documents = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed FROM abroad_documents WHERE goal_id = ?').get('completed', goal.id);
      const timeline = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed FROM abroad_timeline WHERE goal_id = ?').get(goal.id);
      
      const totalItems = (requirements.total || 0) + (documents.total || 0) + (timeline.total || 0);
      const completedItems = (requirements.completed || 0) + (documents.completed || 0) + (timeline.completed || 0);
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      return { ...goal, progress, requirements, documents, timeline };
    });
    
    console.log('✅ Returning', goalsWithProgress.length, 'goals with progress');
    res.json(goalsWithProgress);
  } catch (err) {
    console.error('❌ Fetch goals error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:goalId', (req, res) => {
  try {
    const goal = db.prepare('SELECT * FROM abroad_goals WHERE id = ? AND user_id = ?').get(req.params.goalId, req.userId);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    
    const requirements = db.prepare('SELECT * FROM abroad_requirements WHERE goal_id = ? ORDER BY priority DESC').all(req.params.goalId);
    const documents = db.prepare('SELECT * FROM abroad_documents WHERE goal_id = ? ORDER BY status DESC').all(req.params.goalId);
    const skills = db.prepare('SELECT * FROM abroad_skills WHERE goal_id = ?').all(req.params.goalId);
    const timeline = db.prepare('SELECT * FROM abroad_timeline WHERE goal_id = ? ORDER BY milestone_date ASC').all(req.params.goalId);
    const expenses = db.prepare('SELECT SUM(amount) as total_expenses FROM abroad_expenses WHERE goal_id = ?').get(req.params.goalId);
    
    res.json({
      ...goal,
      requirements,
      documents,
      skills,
      timeline,
      totalExpenses: expenses.total_expenses || 0
    });
  } catch (err) {
    console.error('Error fetching goal detail:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:goalId', (req, res) => {
  try {
    const { visa_status, progress } = req.body;
    const updates = [];
    const params = [];
    
    if (visa_status !== undefined) {
      updates.push('visa_status = ?');
      params.push(visa_status);
    }
    if (progress !== undefined) {
      updates.push('progress = ?');
      params.push(progress);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(req.params.goalId);
    const updateQuery = `UPDATE abroad_goals SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...params);
    
    res.json({ message: 'Goal updated successfully' });
  } catch (err) {
    console.error('Error updating goal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ─── REQUIREMENTS: Manage requirements ─── */
router.post('/requirements/add', (req, res) => {
  try {
    const { goalId, requirement, priority, deadline } = req.body;
    const reqId = uuid();
    
    db.prepare('INSERT INTO abroad_requirements (id, goal_id, requirement, priority, deadline) VALUES (?, ?, ?, ?, ?)')
      .run(reqId, goalId, requirement, priority || 'medium', deadline);
    
    res.json({ id: reqId, message: 'Requirement added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/requirements/:reqId/complete', (req, res) => {
  try {
    db.prepare('UPDATE abroad_requirements SET status = ? WHERE id = ?')
      .run('completed', req.params.reqId);
    res.json({ message: 'Requirement marked as completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── DOCUMENTS: Manage document checklist ─── */
router.post('/documents/add', (req, res) => {
  try {
    const { goalId, documentType, expiryDate, status } = req.body;
    const docId = uuid();
    
    db.prepare('INSERT INTO abroad_documents (id, goal_id, document_type, expiry_date, status) VALUES (?, ?, ?, ?, ?)')
      .run(docId, goalId, documentType, expiryDate, status || 'pending');
    
    res.json({ id: docId, message: 'Document added to checklist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/documents/:goalId', (req, res) => {
  try {
    const documents = db.prepare('SELECT * FROM abroad_documents WHERE goal_id = ? ORDER BY status DESC').all(req.params.goalId);
    const stats = {
      total: documents.length,
      completed: documents.filter(d => d.status === 'completed').length,
      inProgress: documents.filter(d => d.status === 'in_progress').length,
      notStarted: documents.filter(d => d.status === 'pending').length
    };
    res.json({ documents, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/documents/:docId/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE abroad_documents SET status = ? WHERE id = ?').run(status, req.params.docId);
    res.json({ message: 'Document status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── SKILLS: Track skill development ─── */
router.post('/skills/add', (req, res) => {
  try {
    const { goalId, skillName, category, progressLevel } = req.body;
    const skillId = uuid();
    
    db.prepare('INSERT INTO abroad_skills (id, goal_id, skill_name, category, progress_level) VALUES (?, ?, ?, ?, ?)')
      .run(skillId, goalId, skillName, category || 'general', progressLevel || 1);
    
    res.json({ id: skillId, message: 'Skill added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/skills/:goalId', (req, res) => {
  try {
    const skills = db.prepare('SELECT * FROM abroad_skills WHERE goal_id = ?').all(req.params.goalId);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/skills/:skillId/progress', (req, res) => {
  try {
    const { progressLevel } = req.body;
    db.prepare('UPDATE abroad_skills SET progress_level = ? WHERE id = ?')
      .run(progressLevel, req.params.skillId);
    res.json({ message: 'Skill progress updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── TIMELINE: Manage milestones ─── */
router.post('/timeline/add', (req, res) => {
  try {
    const { goalId, milestoneType, milestoneDate } = req.body;
    const timelineId = uuid();
    
    db.prepare('INSERT INTO abroad_timeline (id, goal_id, milestone_type, milestone_date, completed) VALUES (?, ?, ?, ?, ?)')
      .run(timelineId, goalId, milestoneType, milestoneDate, 0);
    
    res.json({ id: timelineId, message: 'Milestone added to timeline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/timeline/:goalId', (req, res) => {
  try {
    const timeline = db.prepare('SELECT * FROM abroad_timeline WHERE goal_id = ? ORDER BY milestone_date ASC').all(req.params.goalId);
    const stats = {
      total: timeline.length,
      completed: timeline.filter(t => t.completed === 1).length,
      upcoming: timeline.filter(t => t.completed === 0).length
    };
    res.json({ timeline, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/timeline/:timelineId/complete', (req, res) => {
  try {
    db.prepare('UPDATE abroad_timeline SET completed = 1 WHERE id = ?')
      .run(req.params.timelineId);
    res.json({ message: 'Milestone completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── EXPENSES: Budget tracking ─── */
router.post('/expenses/add', (req, res) => {
  try {
    const { goalId, category, amount, paidStatus } = req.body;
    const expenseId = uuid();
    
    db.prepare('INSERT INTO abroad_expenses (id, goal_id, category, amount, paid_status) VALUES (?, ?, ?, ?, ?)')
      .run(expenseId, goalId, category, amount || 0, paidStatus || 'planned');
    
    res.json({ id: expenseId, message: 'Expense tracked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/expenses/:goalId', (req, res) => {
  try {
    const expenses = db.prepare('SELECT * FROM abroad_expenses WHERE goal_id = ?').all(req.params.goalId);
    const stats = db.prepare('SELECT SUM(CASE WHEN paid_status = ? THEN amount ELSE 0 END) as spent, SUM(CASE WHEN paid_status = ? THEN amount ELSE 0 END) as planned FROM abroad_expenses WHERE goal_id = ?')
      .get('paid', 'planned', req.params.goalId);
    
    res.json({ 
      expenses,
      totalSpent: stats.spent || 0,
      totalPlanned: stats.planned || 0,
      totalBudget: (stats.spent || 0) + (stats.planned || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── MENTOR NOTES: Recommendations & guidance ─── */
router.post('/mentor-notes/add', (req, res) => {
  try {
    const { goalId, category, note } = req.body;
    const noteId = uuid();
    
    db.prepare('INSERT INTO abroad_mentor_notes (id, goal_id, category, note) VALUES (?, ?, ?, ?)')
      .run(noteId, goalId, category || 'general', note);
    
    res.json({ id: noteId, message: 'Mentor note added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mentor-notes/:goalId', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM abroad_mentor_notes WHERE goal_id = ?').all(req.params.goalId);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── ANALYTICS: Goal progress summary ─── */
router.get('/analytics/:goalId', (req, res) => {
  try {
    const goal = db.prepare('SELECT * FROM abroad_goals WHERE id = ?').get(req.params.goalId);
    const reqs = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as done FROM abroad_requirements WHERE goal_id = ?').get('completed', req.params.goalId);
    const docs = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as done FROM abroad_documents WHERE goal_id = ?').get('completed', req.params.goalId);
    const skills = db.prepare('SELECT AVG(progress_percent) as avg_progress FROM abroad_skills WHERE goal_id = ?').get(req.params.goalId);
    const expenses = db.prepare('SELECT SUM(amount_usd) as total FROM abroad_expenses WHERE goal_id = ?').get(req.params.goalId);
    
    res.json({
      requirementsProgress: reqs.total > 0 ? Math.round((reqs.done / reqs.total) * 100) : 0,
      documentsProgress: docs.total > 0 ? Math.round((docs.done / docs.total) * 100) : 0,
      skillsProgress: skills.avg_progress || 0,
      totalBudget: expenses.total || 0,
      daysUntilIntake: calculateDaysUntil(goal.intake_year, goal.intake_month),
      completionRate: goal.overall_progress
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function calculateDaysUntil(year, month) {
  const monthNum = new Date(`${month} 1`).getMonth() + 1;
  const targetDate = new Date(year, monthNum - 1, 1);
  const today = new Date();
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default router;
