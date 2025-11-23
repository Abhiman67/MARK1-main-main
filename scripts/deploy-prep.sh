#!/bin/bash

# Deployment preparation script for AI Career Coach

echo "🚀 Preparing for deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set. Please add it to .env.local"
    echo "   For Vercel Postgres, use: DATABASE_URL=\${POSTGRES_PRISMA_URL}"
    echo "   For Neon, use: DATABASE_URL=postgresql://user:pass@host/db?sslmode=require"
    exit 1
fi

echo "✅ DATABASE_URL found"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run prisma:generate

# Check if migrations exist
if [ ! -d "prisma/migrations" ]; then
    echo "📝 Creating initial migration..."
    npm run prisma:migrate
else
    echo "✅ Migrations directory exists"
fi

# Build the project
echo "🔨 Building Next.js app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'feat: Add deployment configuration'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy on Vercel:"
    echo "   - Go to vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Add Vercel Postgres storage"
    echo "   - Add environment variables (see DEPLOYMENT.md)"
    echo ""
    echo "3. Run migrations on Vercel:"
    echo "   vercel env pull"
    echo "   npm run prisma:migrate:deploy"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
