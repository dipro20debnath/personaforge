# Setup Admin Account in Production (Vercel + Railway)

The admin account doesn't exist in your production database yet. Follow these steps to create it:

## Option 1: Quick Setup (Easiest) ✅

### Step 1: Get Your Database URL from Railway

1. Go to https://railway.app
2. Log in with your account
3. Click on your **PersonaForge** project
4. Click on **PostgreSQL** service
5. Go to the **Connect** tab
6. Copy the full connection string that looks like:
   ```
   postgresql://user:password@host:port/database
   ```

### Step 2: Run Setup Script

In your terminal (from the server directory):

```bash
cd personaforge/server

# Replace YOUR_DATABASE_URL with the actual URL you copied
DATABASE_URL="postgresql://user:password@host:port/database" node setup-admin-prod.js
```

You should see:
```
🔧 PersonaForge Production Admin Setup
=======================================

✅ Connected to PostgreSQL database
✅ Created new admin user: dipro@gmail.com

✨ Admin Account Details:
   Email: dipro@gmail.com
   Password: Ak472002#@
   Role: admin
   Status: ACTIVE

🚀 You can now login at https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app
```

### Step 3: Test Login on Vercel

1. Go to https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app
2. Email: `dipro@gmail.com`
3. Password: `Ak472002#@`
4. You should now see **⚙️ Administration** in the sidebar

---

## Option 2: Manual Setup via Railway Dashboard

If the script doesn't work, you can manually add the admin user:

### Step 1: Access Railway Database

1. Go to https://railway.app
2. Click your PersonaForge project
3. Click on **PostgreSQL**
4. Click **Data** tab
5. Click **Query**

### Step 2: Add Admin User

Copy and paste this SQL (replace password hash):

```sql
-- First, get a new UUID
-- You'll need to copy an admin password hash from the demo account or generate one

INSERT INTO users (id, email, password, role) 
VALUES (
  gen_random_uuid(),
  'dipro@gmail.com',
  '$2a$12$YOUR_BCRYPT_HASH_HERE', -- This is bcrypt hash of 'Ak472002#@'
  'admin'
);

-- Then add the profile
INSERT INTO profiles (user_id, display_name) 
SELECT id, 'Admin' FROM users WHERE email = 'dipro@gmail.com';
```

**To generate the bcrypt hash**, run this in your terminal:

```bash
cd personaforge/server
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Ak472002#@', 12));"
```

Then replace `YOUR_BCRYPT_HASH_HERE` with the output hash.

---

## Option 3: Alternative - Use Environment Variable in Railway

If you want to persist the DATABASE_URL setup:

1. Go to Railway project settings
2. Add environment variable: `DATABASE_URL` (Railway should already have this)
3. Then you can run the script anytime with just:
   ```bash
   node setup-admin-prod.js
   ```

---

## Troubleshooting

### "Error: getaddrinfo ENOTFOUND"
- Database URL is wrong
- Check Railway for correct PostgreSQL connection string

### "Error: password authentication failed"
- Wrong username or password in the DATABASE_URL
- Get fresh URL from Railway dashboard

### "Error: relation 'users' does not exist"
- Database tables haven't been created yet
- Run migrations first or ensure backend has created tables

### Script runs but admin account doesn't appear
- Check if tables exist in Railway Data tab
- Verify the email address: `dipro@gmail.com` (case-sensitive)

---

## After Setup

Once the admin account is created:

✅ You can login to the admin panel on Vercel  
✅ The admin credentials persist in production  
✅ New users can still signup normally  
✅ Admin gets full access to see all system data

## Admin Features

After logging in with admin account, you should see:
- ⚙️ **Administration** in sidebar
- **Admin Dashboard** with system stats
- **User Management** to view/delete users
- **Activity Logs** to track system events
- **Content Moderation** for journal entries
- **System Settings** for configuration

---

## Important Notes

- **Don't share** the admin password in public repositories
- **Change the password** in production later via the admin panel (when feature is added)
- **Backup your password** somewhere safe
- Admin credentials: `dipro@gmail.com` / `Ak472002#@`
