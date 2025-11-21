# Neon DB Setup Guide

## Step 1: Create Neon Account & Database

1. Go to https://neon.tech
2. Click "Sign Up" and use your GitHub account (recommended)
3. Create a new project:
   - Name: `resume-builder` (or your preferred name)
   - Region: Choose closest to you (e.g., US East, EU West)
   - Postgres version: 15 or 16 (either works)
4. Wait 10 seconds for provisioning

## Step 2: Get Connection String

After project creation, you'll see your connection string. It looks like:
```
postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important:** Copy this entire string! You'll need it in the next step.

## Step 3: Create Environment File

Create a file named `.env.local` in your project root (if it doesn't exist):

```bash
# Database
DATABASE_URL="your-neon-connection-string-here"

# NextAuth (for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# OpenAI API (for AI features)
OPENAI_API_KEY="your-openai-key-if-you-have-one"
```

**Replace:**
- `your-neon-connection-string-here` with the actual Neon connection string
- `your-secret-key-here` with a random secret (run: `openssl rand -base64 32`)

## Step 4: Install Required Dependencies

Run these commands in your terminal:

```bash
# Install Prisma if not already installed
npm install @prisma/client

# Install NextAuth for authentication
npm install next-auth @auth/prisma-adapter

# Install bcrypt for password hashing
npm install bcryptjs
npm install -D @types/bcryptjs
```

## Step 5: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Seed some test data
npx prisma db seed
```

## Step 6: Test Connection

Run this command to open Prisma Studio (database GUI):

```bash
npx prisma studio
```

This will open http://localhost:5555 where you can view and edit your database.

## Step 7: Update Your App to Use Database

The app currently uses localStorage. We'll need to:
1. Create API routes for CRUD operations
2. Add authentication (NextAuth)
3. Replace localStorage calls with API calls

## Troubleshooting

**Error: "Can't reach database server"**
- Check your connection string is correct
- Ensure `?sslmode=require` is at the end

**Error: "Migration failed"**
- Delete `prisma/migrations` folder
- Run `npx prisma migrate dev --name init` again

**Error: "Module not found: @prisma/client"**
- Run `npm install @prisma/client`
- Run `npx prisma generate`

## Next Steps

Once database is connected:
1. ✅ Set up NextAuth for user authentication
2. ✅ Create API routes for resume CRUD
3. ✅ Replace localStorage with database calls
4. ✅ Deploy to Vercel

---

Ready to proceed? Let me know when you have:
1. ✅ Created Neon account
2. ✅ Got connection string
3. ✅ Created .env.local file

Then I'll help you with the authentication and API routes!
