import express from 'express';
import { body, validationResult } from 'express-validator';
import * as aiService from '../services/ai.js';
import { limiters } from '../middleware/security.js';

const router = express.Router();

// Middleware to check for validation errors
const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/ai/goal-recommendations
// Generate personalized goal recommendations
router.post(
  '/goal-recommendations',
  limiters.ai,
  [
    body('name').optional().isString().trim(),
    body('currentRole').optional().isString().trim(),
    body('interests').optional().isArray(),
    body('timeframe').optional().isString().trim(),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const userProfile = req.body;
      const recommendations = await aiService.generateGoalRecommendations(userProfile);
      res.json({
        success: true,
        recommendations,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Goal recommendations error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  }
);

// POST /api/ai/journal-insights
// Analyze journal entries for insights
router.post(
  '/journal-insights',
  limiters.ai,
  [
    body('entries').isArray().notEmpty(),
    body('entries.*.id').optional().isString(),
    body('entries.*.content').isString().trim().notEmpty(),
    body('entries.*.date').optional().isISO8601(),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const { entries } = req.body;
      const insights = await aiService.analyzeJournalInsights(entries);
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Journal insights error:', error);
      res.status(500).json({ error: 'Failed to analyze journal' });
    }
  }
);

// POST /api/ai/habit-suggestions
// Generate habit suggestions
router.post(
  '/habit-suggestions',
  limiters.ai,
  [
    body('currentHabits').optional().isArray(),
    body('currentHabits.*.name').optional().isString(),
    body('currentHabits.*.frequency').optional().isString(),
    body('goals').optional().isArray(),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const { currentHabits } = req.body;
      const suggestions = await aiService.generateHabitSuggestions(currentHabits || []);
      res.json({
        success: true,
        suggestions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Habit suggestions error:', error);
      res.status(500).json({ error: 'Failed to generate habit suggestions' });
    }
  }
);

// POST /api/ai/learning-path
// Generate personalized learning path
router.post(
  '/learning-path',
  limiters.ai,
  [
    body('goal').isString().trim().notEmpty(),
    body('currentSkills').optional().isArray(),
    body('timeframe').optional().isString(),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const { goal, currentSkills } = req.body;
      const learningPath = await aiService.generateLearningPath(goal, currentSkills || []);
      res.json({
        success: true,
        learningPath,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Learning path error:', error);
      res.status(500).json({ error: 'Failed to generate learning path' });
    }
  }
);

// POST /api/ai/skill-gaps
// Analyze skill gaps for career transition
router.post(
  '/skill-gaps',
  limiters.ai,
  [
    body('currentSkills').optional().isArray(),
    body('targetRole').isString().trim().notEmpty(),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const { currentSkills, targetRole } = req.body;
      const analysis = await aiService.analyzeSkillGaps(currentSkills || [], targetRole);
      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Skill gap analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze skill gaps' });
    }
  }
);

// POST /api/ai/motivation
// Generate motivational insights
router.post(
  '/motivation',
  limiters.ai,
  [
    body('goalsCompleted').optional().isInt({ min: 0 }),
    body('habitsTracked').optional().isInt({ min: 0 }),
    body('streak').optional().isInt({ min: 0 }),
    body('recentAchievements').optional().isArray(),
  ],
  handleErrors,
  async (req, res) => {
    try {
      const userProgress = req.body;
      const insights = await aiService.generateMotivationalInsights(userProgress);
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Motivation insights error:', error);
      res.status(500).json({ error: 'Failed to generate motivation insights' });
    }
  }
);

export default router;
