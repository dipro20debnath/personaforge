import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all recommendations for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT ar.*, 
             s.name as skill_name,
             g.title as goal_title,
             lp.title as learning_path_title
      FROM ai_recommendations ar
      LEFT JOIN skills s ON ar.skill_id = s.id
      LEFT JOIN goals g ON ar.goal_id = g.id
      LEFT JOIN learning_paths lp ON ar.learning_path_id = lp.id
      WHERE ar.user_id = $1
    `;
    const params = [userId];

    if (type) {
      query += ` AND ar.type = $${params.length + 1}`;
      params.push(type);
    }

    query += ` ORDER BY ar.created_at DESC LIMIT 50`;

    const result = await db.query(query, params);
    res.json({ data: result.rows, status: 200 });
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get recommendations by category
router.get('/category/:category', authMiddleware, async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT ar.*, 
              s.name as skill_name,
              g.title as goal_title,
              lp.title as learning_path_title
       FROM ai_recommendations ar
       LEFT JOIN skills s ON ar.skill_id = s.id
       LEFT JOIN goals g ON ar.goal_id = g.id
       LEFT JOIN learning_paths lp ON ar.learning_path_id = lp.id
       WHERE ar.user_id = $1 AND ar.category = $2
       ORDER BY ar.created_at DESC`,
      [userId, category]
    );

    res.json({ data: result.rows, status: 200 });
  } catch (error) {
    console.error('❌ Error fetching category recommendations:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get personality-based recommendations
router.get('/personality', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's latest assessment
    const assessment = await db.query(
      `SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (assessment.rows.length === 0) {
      return res.json({ 
        data: [], 
        message: 'Complete assessment first', 
        status: 200 
      });
    }

    const traits = assessment.rows[0];

    // Get existing recommendations
    const result = await db.query(
      `SELECT * FROM ai_recommendations 
       WHERE user_id = $1 AND type = 'personality'
       ORDER BY created_at DESC`,
      [userId]
    );

    // If no recommendations yet, generate based on personality
    if (result.rows.length === 0) {
      const recommendations = generatePersonalityRecommendations(traits);
      
      // Save recommendations
      for (const rec of recommendations) {
        await db.query(
          `INSERT INTO ai_recommendations 
           (user_id, type, category, title, description, recommendation, reason)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            userId,
            'personality',
            rec.category,
            rec.title,
            rec.description,
            rec.recommendation,
            rec.reason
          ]
        );
      }

      return res.json({ data: recommendations, status: 200 });
    }

    res.json({ data: result.rows, status: 200 });
  } catch (error) {
    console.error('❌ Error fetching personality recommendations:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get skill gap analysis recommendations
router.get('/skills/gaps', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all skills with gaps
    const result = await db.query(
      `SELECT 
        s.*,
        (s.target_level - s.self_level) as gap
       FROM skills s
       WHERE s.user_id = $1 AND s.target_level > s.self_level
       ORDER BY gap DESC`,
      [userId]
    );

    const skillGaps = result.rows;
    const recommendations = [];

    // Generate recommendations for each skill gap
    for (const skill of skillGaps) {
      const rec = {
        skill_id: skill.id,
        type: 'skill_gap',
        category: skill.category,
        title: `Improve ${skill.name}`,
        description: `Current level: ${skill.self_level}/5 | Target: ${skill.target_level}/5 | Gap: ${skill.gap}`,
        recommendation: generateSkillRecommendation(skill),
        reason: `This skill has a gap of ${skill.gap} levels. Consider targeted learning.`
      };

      recommendations.push(rec);

      // Save recommendation
      await db.query(
        `INSERT INTO ai_recommendations 
         (user_id, skill_id, type, category, title, description, recommendation, reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          userId,
          skill.id,
          rec.type,
          rec.category,
          rec.title,
          rec.description,
          rec.recommendation,
          rec.reason
        ]
      );
    }

    res.json({ data: recommendations, status: 200 });
  } catch (error) {
    console.error('❌ Error fetching skill gaps:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get learning path recommendations
router.get('/learning-paths', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's assessment
    const assessment = await db.query(
      `SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    // Get user's skills
    const skills = await db.query(
      `SELECT * FROM skills WHERE user_id = $1`,
      [userId]
    );

    // Get paths user isn't enrolled in
    const paths = await db.query(
      `SELECT lp.* FROM learning_paths lp
       WHERE lp.id NOT IN (
         SELECT path_id FROM learning_enrollments WHERE user_id = $1
       )
       LIMIT 10`,
      [userId]
    );

    res.json({ 
      data: paths.rows, 
      analysis: {
        skillCount: skills.rows.length,
        assessmentCompleted: assessment.rows.length > 0
      },
      status: 200 
    });
  } catch (error) {
    console.error('❌ Error fetching learning paths:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Create recommendation (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ error: 'Forbidden', status: 403 });
    }

    const { user_id, type, category, title, description, recommendation, reason } = req.body;

    const result = await db.query(
      `INSERT INTO ai_recommendations 
       (user_id, type, category, title, description, recommendation, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, type, category, title, description, recommendation, reason]
    );

    res.json({ data: result.rows[0], status: 200 });
  } catch (error) {
    console.error('❌ Error creating recommendation:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Helper function: Generate personality-based recommendations
function generatePersonalityRecommendations(traits) {
  const recommendations = [];

  // High openness
  if (traits.openness > 75) {
    recommendations.push({
      category: 'learning',
      title: 'Explore New Fields',
      description: 'You have high openness to experience.',
      recommendation: 'Consider enrolling in diverse learning paths across multiple disciplines. Your curiosity is your strength!',
      reason: 'High Openness personality trait'
    });
  }

  // High conscientiousness
  if (traits.conscientiousness > 75) {
    recommendations.push({
      category: 'goal',
      title: 'Set Ambitious Goals',
      description: 'Your conscientiousness is a major strength.',
      recommendation: 'Set detailed, measurable goals with milestones. Your disciplined nature will help you achieve them.',
      reason: 'High Conscientiousness personality trait'
    });
  }

  // High extraversion
  if (traits.extraversion > 75) {
    recommendations.push({
      category: 'skill',
      title: 'Develop Leadership Skills',
      description: 'You have natural leadership potential.',
      recommendation: 'Invest in public speaking, team management, and communication skills.',
      reason: 'High Extraversion personality trait'
    });
  }

  // High agreeableness
  if (traits.agreeableness > 75) {
    recommendations.push({
      category: 'skill',
      title: 'Enhance Collaboration',
      description: 'Your empathy is valuable.',
      recommendation: 'Focus on teamwork, emotional intelligence, and conflict resolution.',
      reason: 'High Agreeableness personality trait'
    });
  }

  // High neuroticism
  if (traits.neuroticism > 75) {
    recommendations.push({
      category: 'wellness',
      title: 'Prioritize Mental Health',
      description: 'Consider stress management techniques.',
      recommendation: 'Develop mindfulness, meditation, and stress-management practices. Consider journaling for emotional processing.',
      reason: 'Elevated Neuroticism trait - focus on wellness'
    });
  }

  // Low openness
  if (traits.openness < 25) {
    recommendations.push({
      category: 'growth',
      title: 'Embrace New Experiences',
      description: 'Small steps toward openness.',
      recommendation: 'Try one new activity or idea each month. Openness is a skill that improves with practice.',
      reason: 'Lower Openness - growth opportunity'
    });
  }

  return recommendations;
}

// Helper function: Generate skill recommendations
function generateSkillRecommendation(skill) {
  const gap = skill.target_level - skill.self_level;
  
  if (gap <= 1) {
    return `You're close to your target! Continue with practice and targeted learning.`;
  } else if (gap <= 2) {
    return `Moderate gap identified. Consider online courses or mentorship to bridge this gap.`;
  } else {
    return `Significant gap detected. Recommend a structured learning plan with regular practice and feedback.`;
  }
}

export default router;
