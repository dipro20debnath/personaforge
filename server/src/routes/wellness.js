import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get wellness metrics for date range
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT * FROM wellness_metrics 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (startDate) {
      query += ` AND date >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND date <= $${params.length + 1}`;
      params.push(endDate);
    }

    query += ` ORDER BY date DESC`;

    const result = await db.query(query, params);
    res.json({ data: result.rows, status: 200 });
  } catch (error) {
    console.error('❌ Error fetching wellness metrics:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get today's wellness entry
router.get('/today', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const result = await db.query(
      `SELECT * FROM wellness_metrics 
       WHERE user_id = $1 AND date = $2`,
      [userId, today]
    );

    res.json({ 
      data: result.rows[0] || null, 
      status: 200 
    });
  } catch (error) {
    console.error('❌ Error fetching today wellness:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Get wellness analytics (averages, trends)
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const days = req.query.days || 30;

    const result = await db.query(
      `SELECT 
        AVG(stress_level) as avg_stress,
        AVG(sleep_hours) as avg_sleep,
        AVG(exercise_minutes) as avg_exercise,
        AVG(water_intake) as avg_water,
        AVG(meditation_minutes) as avg_meditation,
        AVG(energy_level) as avg_energy,
        AVG(mood_score) as avg_mood,
        MIN(stress_level) as min_stress,
        MAX(stress_level) as max_stress,
        COUNT(*) as total_entries
      FROM wellness_metrics 
      WHERE user_id = $1 AND date > CURRENT_DATE - INTERVAL '1 day' * $2`,
      [userId, days]
    );

    const analytics = result.rows[0];
    
    // Get trend data (last 7 days)
    const trendResult = await db.query(
      `SELECT date, stress_level, sleep_hours, exercise_minutes, mood_score
       FROM wellness_metrics 
       WHERE user_id = $1 AND date > CURRENT_DATE - INTERVAL '7 days'
       ORDER BY date ASC`,
      [userId]
    );

    res.json({ 
      data: {
        analytics,
        trends: trendResult.rows
      }, 
      status: 200 
    });
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Create or update wellness entry
router.post('/', auth, async (req, res) => {
  try {
    const { stress_level, sleep_hours, exercise_minutes, water_intake, meditation_minutes, energy_level, mood_score, notes } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if entry exists for today
    const existing = await db.query(
      `SELECT id FROM wellness_metrics 
       WHERE user_id = $1 AND date = $2`,
      [userId, today]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update
      result = await db.query(
        `UPDATE wellness_metrics SET 
          stress_level = COALESCE($1, stress_level),
          sleep_hours = COALESCE($2, sleep_hours),
          exercise_minutes = COALESCE($3, exercise_minutes),
          water_intake = COALESCE($4, water_intake),
          meditation_minutes = COALESCE($5, meditation_minutes),
          energy_level = COALESCE($6, energy_level),
          mood_score = COALESCE($7, mood_score),
          notes = COALESCE($8, notes)
        WHERE user_id = $9 AND date = $10
        RETURNING *`,
        [stress_level, sleep_hours, exercise_minutes, water_intake, meditation_minutes, energy_level, mood_score, notes, userId, today]
      );
    } else {
      // Create
      result = await db.query(
        `INSERT INTO wellness_metrics 
         (user_id, date, stress_level, sleep_hours, exercise_minutes, water_intake, meditation_minutes, energy_level, mood_score, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [userId, today, stress_level || 5, sleep_hours || 7.0, exercise_minutes || 0, water_intake || 0, meditation_minutes || 0, energy_level || 5, mood_score || 5, notes || '']
      );
    }

    res.json({ data: result.rows[0], status: 200 });
  } catch (error) {
    console.error('❌ Error saving wellness entry:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Delete wellness entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `DELETE FROM wellness_metrics 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found', status: 404 });
    }

    res.json({ data: { message: 'Deleted successfully' }, status: 200 });
  } catch (error) {
    console.error('❌ Error deleting wellness entry:', error);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

export default router;
