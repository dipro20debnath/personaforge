import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './migrate.js';
import {
  securityHeaders,
  limiters,
  corsOptions,
  securityLogging,
  secureErrorHandler,
} from './middleware/security.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import assessmentRoutes from './routes/assessment.js';
import skillsRoutes from './routes/skills.js';
import goalsRoutes from './routes/goals.js';
import habitsRoutes from './routes/habits.js';
import journalRoutes from './routes/journal.js';
import learningRoutes from './routes/learning.js';
import notificationsRoutes from './routes/notifications.js';
import privacyRoutes from './routes/privacy.js';
import dashboardRoutes from './routes/dashboard.js';
import dailyRoutineRoutes from './routes/daily-routine.js';
import motivationRoutes from './routes/motivation.js';
import moneyManagementRoutes from './routes/money-management.js';
import voiceAssistantRoutes from './routes/voice-assistant.js';
import abroadGoalsRoutes from './routes/abroad-goals.js';
import aiRoutes from './routes/ai-recommendations.js';
import wellnessRoutes from './routes/wellness.js';
import recommendationsRoutes from './routes/recommendations.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for Railway/Vercel deployments
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(securityLogging);

// Body parsing
app.use(express.json());

// General rate limiting
app.use(limiters.general);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', name: 'PersonaForge API' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/daily-routine', dailyRoutineRoutes);
app.use('/api/motivation', motivationRoutes);
app.use('/api/money-management', moneyManagementRoutes);
app.use('/api/voice-assistant', voiceAssistantRoutes);
app.use('/api/abroad-goals', abroadGoalsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(secureErrorHandler);

const PORT = process.env.PORT || 5000;

// Initialize database and start server
(async () => {
  // Run database initialization for production
  if (process.env.DATABASE_URL) {
    console.log('🔄 Initializing production database...');
    await initializeDatabase();
  }
  
  app.listen(PORT, () => console.log(`🚀 PersonaForge API running on http://localhost:${PORT}`));
})();
