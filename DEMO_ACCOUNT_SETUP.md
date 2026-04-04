# 🚀 PersonaForge - Demo Account Setup Guide

## 🎬 Quick Start with Demo Account

### Step 1: Install & Setup
```bash
npm run install:all
```
This will:
- Install all dependencies
- Set up the database
- **Automatically create demo account** with 78% field completion
- Seed 100 motivational quotes
- Create 6 learning paths

### Step 2: Start Development Server
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Step 3: Login with Demo Account
On the login page, you'll see:

**Email**: `demo@personaforge.com`
**Password**: `Demo@123`

You can either:
- Click "Use Demo Credentials" button (auto-fills form)
- Copy credentials individually (clipboard buttons)
- Type manually

---

## 📋 What's Included in Demo Account

The demo account `demo@personaforge.com` includes realistic data across all modules:

### Personal Profile (78% Complete)
- ✅ Name: Alex Johnson
- ✅ Bio: Personal growth enthusiast | 100-day journey
- ✅ Avatar: Professional gravatar
- ✅ Location: New York, United States
- ✅ Level: 6 (Advanced)
- ✅ XP: 4,850 points
- ✅ Birthday: June 15, 1995

### Life Goals (5 Active)
- 🏃 Run Marathon (77% complete)
- 🇪🇸 Learn Spanish (65% complete)
- 📖 Write a Book (42% complete)
- 🧘 Meditate Daily (76% complete)
- 💰 Save $10K (78.5% complete)

### Habit Tracking (6 habits)
- ✅ Morning Meditation: 78 day streak
- ✅ Exercise: 45 day streak
- ✅ Read 30 min: 62 day streak
- ✅ Journal: 38 day streak
- ✅ Learn Spanish: 52 day streak
- ✅ Network: 12 week streak

### Financial Overview
- 💰 Total Income: $5,800
- 💸 Total Expenses: $825
- 🏦 Assets: $20,350
- 💳 Liabilities: $2,400
- 📊 Net Worth: $17,950

### Learning Paths (5 Enrolled)
- Communication Mastery: 85% complete
- Leadership: 62% complete
- Web Development: 45% complete
- Emotional Intelligence: 78% complete
- Financial Literacy: 68% complete

### Journal (8 Entries)
- Reflections from the past month
- Mood tracking
- Personal growth insights

### Skills (7 Developed)
- Running (Level 7/9)
- Spanish (Level 6/9)
- Meditation (Level 7/8)
- Leadership (Level 7/8)
- Public Speaking (Level 6/8)
- Writing (Level 6/8)
- Financial Management (Level 7/9)

### 100-Day Challenge
- ✅ Days Completed: 78/100
- 🎯 Current Phase: Bloom Phase
- 📍 Progress: 78% through journey

### Daily Routine (Today's Schedule)
- 11 scheduled activities
- 55% completion rate
- Mix of wellness, work, learning, and personal activities

### Voice Assistant History
- 5 sample commands recorded
- 100% success rate
- Located on Voice Assistant page

---

## 🎨 UI Features to Explore

### Login Page Enhancements
The login page now includes:
- 🎬 Demo account info box (blue section)
- 📋 Email display with copy button
- 🔐 Password display with copy button
- ⚡ "Use Demo Credentials" quick-fill button
- 📋 Email/password input fields
- 🔗 Sign-up link for new accounts

### Dashboard (After Login)
View:
- Overall stats and progress
- Active goals with progress bars
- Habit streaks
- Recent journal entries
- Skills development
- Financial summary
- Notifications

### Feature Pages
- **Profile**: Complete personal information
- **Goals**: 5 goals with milestones
- **Habits**: 6 habits with detailed stats
- **Journal**: 8 dated entries with moods
- **Learning**: 5 active learning paths
- **Money**: Financial tracking with charts
- **Skills**: 7 skill profiles
- **Voice Assistant**: 5 sample commands
- **Motivation**: 100-day challenge at 78%
- **Daily Routine**: 11 activities with completion tracking

---

## 🔧 Development Notes

### Database Setup
The demo account is created during the `fix.mjs` setup script:
```javascript
// Automatically runs when npm run install:all is executed
// Creates demo user with realistic data across all tables
// Demonstrates all features of PersonaForge
```

### What Gets Seeded
1. **Demo User**: demo@personaforge.com / Demo@123
2. **Profile**: Complete with 7/9 fields (78%)
3. **Personality Assessment**: Big Five traits
4. **5 Goals**: With varying progress levels
5. **6 Habits**: With realistic streak data
6. **8 Journal Entries**: With mood tracking
7. **7 Skills**: With self/target/world averages
8. **5 Learning Paths**: With progress
9. **Daily Routine**: 11 activities
10. **Financial Data**: Income, expenses, assets, liabilities
11. **100-Day Challenge**: 78 days completed
12. **Voice Commands**: 5 sample records

### Files Modified
- `fix.mjs` - Added demo account seeding
- `client/src/app/login/page.tsx` - Added demo info UI
- Database schema extended with voice_commands table

---

## 🧪 Testing Checklist

After logging in with demo account:

- [ ] Dashboard shows all stats correctly
- [ ] Goals display with progress bars
- [ ] Habits show with accurate streaks
- [ ] Journal entries load with dates
- [ ] Skills show levels and comparisons
- [ ] Learning paths show progress
- [ ] Money management shows net worth
- [ ] Voice assistant has command history
- [ ] 100-day challenge shows 78% completion
- [ ] Daily routine shows 11 activities
- [ ] Profile displays all information
- [ ] Charts and graphs render correctly
- [ ] Mobile responsive layout works
- [ ] Dark/light mode toggles properly

---

## 📊 Data Completion Stats

| Section | Fields | Completed | % |
|---------|--------|-----------|---|
| Profile | 9 | 7 | 78% |
| Goals | 5 | 5 | 100% |
| Habits | 6 | 6 | 100% |
| Journal | 8 | 8 | 100% |
| Skills | 7 | 7 | 100% |
| Learning | 5 | 5 | 100% |
| Financial | 9 | 9 | 100% |
| Routine | 11 | 11 | 100% |
| Challenge | 100 | 78 | 78% |
| Voice Cmds | 5 | 5 | 100% |
| **TOTAL** | **84** | **66** | **78.6%** |

---

## 🎯 Use Cases

### Demo for Presentations
Show stakeholders what a fully-populated account looks like with realistic progress across all features.

### Testing Features
Test individual features with consistent, known data without needing to populate everything manually.

### User Onboarding
New developers can see what a mature account looks like and understand all features quickly.

### Feature Development
Build and test new features against a complete dataset.

---

## 🔄 Reset Demo Account

To reset the demo account and start fresh:

1. Delete the database file:
   ```bash
   rm server/personaforge.db
   ```

2. Run setup again:
   ```bash
   npm run install:all
   ```

3. New demo account with same credentials will be created

---

## 🌐 Project Structure

```
personaforge/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/        # Login page with demo info
│   │   │   ├── (app)/        # Protected app routes
│   │   │   └── ...
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts        # API client
│   │   └── context/
│   ├── package.json
│   └── tsconfig.json
│
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── db.js             # sql.js database setup
│   │   ├── index.js          # Main app file
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── personaforge.db       # SQLite database (created on first run)
│
├── fix.mjs                    # Setup & demo account seeding
├── package.json               # Root package
└── DEMO_ACCOUNT_INFO.md       # Demo details
```

---

## 🚀 Next Steps

### After Testing Demo
1. Create your own account at `/register`
2. Start building your personal growth journey
3. Set your own goals and track habits
4. Explore all features with real data

### For Development
- Examine database queries with demo data
- Test components with populated information
- Build new features with realistic data set

### For Deployment
- Consider keeping demo account in production
- Useful for onboarding new users
- Test environment for bug reports

---

## 💡 Tips

- **Copy buttons**: Makes entering credentials easy
- **Quick-fill**: "Use Demo Credentials" auto-populates form
- **Detailed profile**: Shows what a mature account looks like
- **Mixed completion**: 78% shows realistic progress (not perfect)
- **Consistent data**: All stats align logically
- **Multiple entries**: Sufficient data for pagination/filtering tests

---

## 📞 Support

### Common Issues

**Q: Demo account not appearing?**
A: Run `npm run install:all` again. Make sure `fix.mjs` executed successfully.

**Q: Can't login?**
A: Check email is `demo@personaforge.com` and password is `Demo@123` (case-sensitive)

**Q: Data looks incomplete?**
A: This is intentional - 78% completion shows realistic progress, not a finished account.

**Q: Ports in use?**
A: Kill existing node processes: `Get-Process node | Stop-Process -Force`

---

**Last Updated**: April 3, 2026
**Status**: Ready for Use ✅
**Completion**: 78% (By Design)
