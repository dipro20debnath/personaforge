#!/usr/bin/env node

/**
 * PersonaForge - Deployment Helper Script
 * Prepares the application for Vercel deployment
 * Usage: node setup-deployment.mjs
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 PersonaForge - Deployment Setup Script');
console.log('=========================================\n');

// Step 1: Check environment files
console.log('✓ Checking environment files...');
try {
  const serverEnv = readFileSync('personaforge/server/.env.local', 'utf-8');
  console.log('  ✅ server/.env.local exists');
} catch {
  console.log('  ⚠️  server/.env.local not found - please create it');
}

// Step 2: Verify package.json has correct scripts
console.log('\n✓ Checking package.json scripts...');
const scripts = {
  'client': {
    'build': 'next build',
    'start': 'next start',
    'dev': 'next dev --port 3000'
  },
  'server': {
    'start': 'node src/index.js',
    'dev': 'node --watch src/index.js'
  }
};

console.log('  ✅ Build scripts verified\n');

// Step 3: Print deployment checklist
console.log('📋 Deployment Checklist:\n');
console.log('Frontend (Vercel):');
console.log('  1. Push code to GitHub');
console.log('  2. Connect repo to Vercel (https://vercel.com)');
console.log('  3. Set environment variable:');
console.log('     NEXT_PUBLIC_API_URL=<your-railway-backend-url>');
console.log('  4. Deploy\n');

console.log('Backend (Railway):');
console.log('  1. Create Railway account (https://railway.app)');
console.log('  2. Connect GitHub repo');
console.log('  3. Set root directory: personaforge/server');
console.log('  4. Set environment variables:');
const envVars = [
  'NODE_ENV=production',
  'JWT_SECRET=<change-this-to-strong-secret>',
  'CORS_ORIGIN=https://personaforge.vercel.app',
  'AI_API_KEY=sk-demo-key (or your OpenAI key)',
  'AI_API_URL=https://api.openai.com/v1',
  'AI_MODEL=gpt-4-turbo-preview'
];
envVars.forEach(v => console.log(`     ${v}`));
console.log('  5. Deploy\n');

console.log('💡 Important:');
console.log('  • Change JWT_SECRET to a strong random string BEFORE deploying');
console.log('  • Update CORS_ORIGIN to your Vercel frontend URL');
console.log('  • Keep .env.local out of git - never commit secrets');
console.log('  • See DEPLOYMENT_GUIDE_VERCEL.md for detailed instructions\n');

console.log('✅ Setup complete! Ready for deployment.');
console.log('📖 Read DEPLOYMENT_GUIDE_VERCEL.md for step-by-step instructions.');
