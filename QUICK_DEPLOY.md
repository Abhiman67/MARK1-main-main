# 🚀 Quick Deploy to Vercel + Database

## ⚡ Fastest Path (5 minutes)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Deploy on Vercel
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **Import Git Repository**
3. Select your `MARK1-main-main` repo
4. Click **Deploy** (auto-detects Next.js)

### 3. Add Database (In Vercel Dashboard)
1. Open your deployed project
2. Go to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Click **Continue** (Free tier selected)
5. ✅ Done! Database URL automatically added

### 4. Add Environment Variables
In **Settings** → **Environment Variables**:

```
GEMINI_API_KEY=AIzaSyDkm7rvEBeJbADH8hpInEW2wMTj0o7ppmQ
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=your-new-secure-jwt-secret-32chars-min
NODE_ENV=production
```

**Note:** `DATABASE_URL` is auto-added by Vercel Postgres

### 5. Run Database Migration
**Option A - Use Vercel CLI** (Recommended):
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma migrate deploy

# Push migration to Vercel
vercel deploy --prod
```

**Option B - Manual** (via Vercel Functions):
1. In Vercel dashboard → **Settings** → **Functions**
2. Enable "Build Command Override"
3. Set: `prisma migrate deploy && npm run build`
4. Redeploy

### 6. Test Your App
Visit `https://your-project.vercel.app` and test:
- ✅ Sign up / Sign in
- ✅ Create resume
- ✅ AI Coach chat
- ✅ Generate professional summary

---

## 🎯 Database Choice Comparison

| Feature | Vercel Postgres | Neon |
|---------|----------------|------|
| Integration | ⭐⭐⭐⭐⭐ Seamless | ⭐⭐⭐⭐ Easy |
| Free Tier | 256MB, 60hrs/mo | 0.5GB storage |
| Setup Steps | 3 clicks | Copy URL manually |
| Auto-scaling | ✅ Yes | ✅ Yes |
| Connection Pooling | ✅ Built-in | ✅ Built-in |
| **Recommendation** | **Best for Vercel** | Good alternative |

**Winner: Vercel Postgres** (easiest with Vercel deploy)

---

## 📝 Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Vercel Postgres database added
- [ ] Environment variables configured
- [ ] Database migration run
- [ ] Production deployment successful
- [ ] Auth flow tested
- [ ] Resume creation tested
- [ ] AI features tested

---

## 🔧 Troubleshooting

**Build fails?**
- Check environment variables are set
- Ensure `DATABASE_URL` uses Vercel Postgres URL
- Check build logs in Vercel dashboard

**Database connection error?**
- Verify Vercel Postgres is created
- Check connection string format
- Ensure SSL mode is enabled

**Migration fails?**
- Run locally first: `npx prisma migrate deploy`
- Check Prisma schema syntax
- Verify database permissions

---

## 💰 Cost (Free Tier)

- **Vercel Hosting:** $0
- **Vercel Postgres:** $0 (256MB, 60hrs/mo)
- **Total:** **$0/month**

Upgrade when needed:
- Pro plan: $20/mo (more resources)
- Postgres upgrade: $0.20/GB + compute

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for:
- Alternative database options
- Local development setup
- Prisma commands reference
- Advanced configuration
