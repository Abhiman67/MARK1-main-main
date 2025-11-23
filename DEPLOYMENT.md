# Deployment Guide - Vercel + Vercel Postgres

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: Add database integration and deployment config"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Add Vercel Postgres Database
**In your Vercel project dashboard:**
1. Go to **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Click **Continue** (uses free plan)
5. Database will be created and environment variables auto-added:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← Use this for Prisma
   - `POSTGRES_URL_NON_POOLING`

### 4. Add Environment Variables
In Vercel project **Settings** → **Environment Variables**, add:

```bash
# Database (auto-added by Vercel Postgres)
DATABASE_URL="${POSTGRES_PRISMA_URL}"

# Google Gemini AI
GEMINI_API_KEY="AIzaSyDkm7rvEBeJbADH8hpInEW2wMTj0o7ppmQ"
GEMINI_MODEL="gemini-2.5-flash"

# JWT Secret (generate new secure key)
JWT_SECRET="your-secure-jwt-secret-min-32-chars"

# App URL
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"

# Node Environment
NODE_ENV="production"
```

### 5. Run Database Migration
**After first deploy, in Vercel project:**
1. Go to **Settings** → **Functions**
2. Or use Vercel CLI locally:
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npm run prisma:migrate:deploy
```

**OR run migration via Vercel's terminal** (in project settings).

### 6. Redeploy
After adding env vars and migrating DB:
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

## Alternative: Use Neon Database

If you prefer Neon (also serverless, free tier):

1. **Create Neon Project:** [neon.tech](https://neon.tech)
2. **Copy Connection String** from Neon dashboard
3. **Add to Vercel env vars:**
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
   ```
4. **Run migration** (same as step 5 above)

## Local Development with Database

### Option 1: Use Vercel Postgres locally
```bash
vercel env pull .env.local
npm run prisma:migrate
npm run dev
```

### Option 2: Use local PostgreSQL
```bash
# Install PostgreSQL locally (brew on macOS)
brew install postgresql@15
brew services start postgresql@15

# Create local database
createdb ai_career_coach

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/ai_career_coach"

# Run migrations
npm run prisma:migrate
npm run dev
```

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration (dev)
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:deploy

# Open Prisma Studio (DB GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Post-Deployment Checklist

- [ ] Database created and connected
- [ ] All environment variables added
- [ ] Database migrations run successfully
- [ ] App builds without errors
- [ ] Test auth flow (sign up/sign in)
- [ ] Test resume creation and saving
- [ ] Test AI coach functionality
- [ ] Check production logs for errors

## Troubleshooting

**Build fails with Prisma error:**
- Ensure `postinstall` script runs `prisma generate`
- Check `DATABASE_URL` is set in Vercel env vars

**Database connection error:**
- Verify connection string format
- For Vercel Postgres, use `POSTGRES_PRISMA_URL`
- Ensure `?sslmode=require` for Neon

**Migration fails:**
- Check database permissions
- Verify connection string is correct
- Use `prisma migrate deploy` not `prisma migrate dev` in production

## Cost Estimate (Free Tiers)

- **Vercel Hosting:** Free (hobby plan)
- **Vercel Postgres:** Free (256MB, 60hrs compute/month)
- **Alternative - Neon:** Free (0.5GB storage)
- **Total:** $0/month for starter usage

Upgrade when you need:
- More database storage
- More compute hours
- Custom domains
- Team collaboration
