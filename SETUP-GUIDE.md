# 🚀 SETUP GUIDE - VOID Metaverse 000

Complete setup instructions for the VOID Metaverse master build.

---

## ✅ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **pnpm** installed (`npm install -g pnpm`)
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Privy Account** ([Sign up](https://dashboard.privy.io))
- [ ] **Supabase Account** ([Sign up](https://supabase.com))

---

## 📦 Step 1: Clone & Install

\`\`\`bash
# Clone the repository
git clone https://github.com/rigofelix2017-rgb/000.git
cd 000

# Install dependencies
pnpm install
# This will install ~250+ packages (React, Next.js, Three.js, Wagmi, etc.)
# Takes 2-3 minutes on average
\`\`\`

---

## 🔑 Step 2: Set Up Privy (Authentication)

1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Create new app or select existing
3. Copy your **App ID** (looks like `clabcd123456789`)
4. In Privy dashboard, configure:
   - **Allowed Domains**: `localhost:3000` (for dev)
   - **Login Methods**: Enable Email, Wallet
   - **Supported Chains**: Ethereum, Base

---

## 🗄️ Step 3: Set Up Supabase (Database)

### Create Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: `void-metaverse`
   - **Database Password**: (save this!)
   - **Region**: (closest to you)
4. Wait 2-3 minutes for project to deploy

### Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbG...`)
   - **service_role key** (starts with `eyJhbG...`)

### Run Migrations

1. Go to **SQL Editor** in Supabase
2. Run each migration file from `scripts/` folder **in order**:
   - `001_create_user_roles_and_profiles.sql`
   - `002_create_player_xp.sql`
   - `003_create_daily_tasks.sql`
   - ... continue through `027_leaderboards.sql`

**OR** use Supabase CLI:

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run all migrations
supabase db push
\`\`\`

---

## 🔧 Step 4: Configure Environment Variables

1. **Copy template**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Fill in required values**:
   \`\`\`env
   # Required for basic functionality
   NEXT_PUBLIC_PRIVY_APP_ID=clabcd123456789
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   \`\`\`

3. **Optional but recommended**:
   \`\`\`env
   # For Web3 features
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_id
   
   # For multiplayer
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   \`\`\`

---

## 🚀 Step 5: Run Development Server

\`\`\`bash
# Start Next.js dev server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

You should see:
1. ⚠️ **Epilepsy Warning** (acknowledge)
2. 🧩 **Consciousness Puzzle** (click 12 cells)
3. 🌌 **VOID Splash** (4 second animation)
4. 🎮 **Main Metaverse** (3D world)

---

## 🎮 Step 6: Test Core Features

### ✅ Systems Hub
1. Press `S` or click floating button (bottom-right)
2. See all 11 systems in grid
3. Click any system to open
4. Press `Escape` to go back

### ✅ Mobile Controls (if on mobile/tablet)
1. See virtual joystick (bottom-left)
2. Drag to move character
3. Tap Systems button (bottom-right)
4. Test orientation change

### ✅ Authentication
1. Click "Connect Wallet" or "Login"
2. Use email OR wallet
3. Complete setup
4. See user profile

### ✅ 3D Movement
1. Desktop: Use `WASD` keys
2. Mobile: Drag joystick
3. Press `Shift` to sprint
4. Camera follows automatically

---

## 🔌 Step 7: Start Multiplayer Server (Optional)

\`\`\`bash
# In a separate terminal
pnpm multiplayer

# Or
node server/multiplayer-server.js
\`\`\`

Server runs on `ws://localhost:8080`

---

## 📊 Step 8: Verify Everything Works

Run these checks:

### ✅ Build Check
\`\`\`bash
pnpm build
\`\`\`
Should complete without errors

### ✅ Type Check
\`\`\`bash
pnpm tsc --noEmit
\`\`\`
May show warnings but should not fail

### ✅ Feature Checklist
- [ ] Home page loads
- [ ] Intro sequence plays
- [ ] 3D scene renders
- [ ] Character moves with WASD
- [ ] Systems Hub opens (press S)
- [ ] All 11 systems accessible
- [ ] Mobile controls work (if on mobile)
- [ ] Authentication works
- [ ] Database queries work
- [ ] No console errors

---

## 🐛 Troubleshooting

### Build Errors

**Problem**: `Cannot find module '@/components/...'`

**Solution**:
\`\`\`bash
# Restart dev server
# Clear Next.js cache
rm -rf .next
pnpm dev
\`\`\`

---

### 3D Scene Blank

**Problem**: White screen, no 3D scene

**Solution**:
1. Check browser console for errors
2. Verify WebGL support: [https://get.webgl.org/](https://get.webgl.org/)
3. Try different browser (Chrome/Firefox recommended)
4. Update GPU drivers

---

### Database Errors

**Problem**: `relation "profiles" does not exist`

**Solution**:
1. Run migrations in Supabase SQL Editor
2. Check if all 27 migration files executed
3. Verify Supabase URL and keys in `.env.local`

---

### Privy Authentication Fails

**Problem**: "Invalid App ID" or login doesn't work

**Solution**:
1. Verify `NEXT_PUBLIC_PRIVY_APP_ID` is correct
2. Check Privy dashboard → Allowed Domains includes `localhost:3000`
3. Clear browser cache and cookies
4. Try incognito mode

---

### Mobile Controls Not Showing

**Problem**: Virtual joystick doesn't appear

**Solution**:
1. Check if device is detected as mobile
2. Open browser DevTools → Console
3. Look for `isMobile` value
4. Try resizing browser to mobile size

---

### Systems Not Opening

**Problem**: Systems Hub button does nothing

**Solution**:
1. Check browser console for errors
2. Verify all 11 systems exist in `components/systems/`
3. Check `systems-hub.tsx` imports
4. Hard refresh browser (Ctrl+Shift+R)

---

## 🎨 Step 9: Customize (Optional)

### Change Theme Colors

Edit `app/globals.css`:

\`\`\`css
:root {
  --primary: 263 70% 50%; /* Change purple accent */
  --secondary: 333 71% 51%; /* Change pink accent */
}
\`\`\`

### Add 3D Models

1. Place `.glb` files in `public/models/`
2. Update `Scene3D` component to load them

### Modify Systems

1. Edit files in `components/systems/`
2. Add new features to existing systems
3. Save and hot-reload automatically

---

## 🚢 Step 10: Deploy to Production

### Vercel (Recommended)

1. **Install Vercel CLI**:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy**:
   \`\`\`bash
   vercel
   \`\`\`

3. **Add Environment Variables**:
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all from `.env.local`

4. **Update Privy**:
   - Add production domain to Privy allowed domains
   - e.g., `your-app.vercel.app`

5. **Update Supabase**:
   - Add production URL to allowed origins

### Docker

1. **Build Image**:
   \`\`\`bash
   docker build -t void-metaverse .
   \`\`\`

2. **Run Container**:
   \`\`\`bash
   docker run -p 3000:3000 --env-file .env.local void-metaverse
   \`\`\`

---

## 📚 Next Steps

Now that you're set up:

1. **Read Documentation**:
   - `README.md` - Project overview
   - `PHASE-7-COMPLETE.md` - Mobile optimization
   - `PHASE-8-COMPLETE.md` - Frontend integration
   - `SYSTEMS-HUB-USER-GUIDE.md` - User guide

2. **Explore Code**:
   - `app/page.tsx` - Main app logic
   - `components/systems-hub.tsx` - Systems Hub
   - `components/systems/` - All 11 game systems
   - `lib/mobile-optimization.ts` - Mobile utilities

3. **Customize**:
   - Add new systems
   - Modify existing features
   - Change theme/styling
   - Add 3D models

4. **Deploy**:
   - Push to GitHub
   - Deploy to Vercel
   - Share with users!

---

## ✅ Setup Complete!

You now have a fully functional VOID Metaverse with:

- ✅ 11 Core Game Systems
- ✅ Systems Hub Interface
- ✅ 3D World Exploration
- ✅ Mobile Optimization
- ✅ Web3 Integration
- ✅ Database & Auth
- ✅ Multiplayer Ready

**Enjoy building in the metaverse!** 🚀

---

## 📞 Need Help?

- **GitHub Issues**: [https://github.com/rigofelix2017-rgb/000/issues](https://github.com/rigofelix2017-rgb/000/issues)
- **Documentation**: See `/docs` folder
- **Stack Overflow**: Tag with `void-metaverse`

---

**Last Updated**: November 9, 2025  
**Version**: 1.0.0
