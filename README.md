# MARK1 - AI Career Coach Platform 🚀

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbhiman67%2FMARK1-main-main)

![MARK1 Logo](https://img.shields.io/badge/MARK1-AI%20Career%20Coach-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

**An advanced AI-powered career coaching platform that helps professionals optimize their resumes, prepare for interviews, and accelerate career growth.**

[Live Demo](#) • [Documentation](PROJECT_REPORT.md) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Key Features Explained](#-key-features-explained)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 AI Career Coach
- **Real-time AI Conversations** - Powered by Google Gemini 2.5 Flash
- **Personalized Career Advice** - Context-aware recommendations
- **Interview Preparation** - Mock interviews and feedback
- **Career Roadmap** - Step-by-step guidance for career goals

### 📄 Smart Resume Builder
- **10+ Professional Templates** - Modern, Classic, Minimal, Creative designs
- **ATS Score Optimization** - Real-time scoring (0-100)
- **AI-Powered Suggestions** - Intelligent content recommendations
- **Multi-format Export** - PDF, JSON, DOCX support
- **Version History** - Track and restore previous versions
- **Resume Import** - Upload existing resumes to edit

### 📊 Career Dashboard
- **Progress Tracking** - Visual analytics and insights
- **Application Timeline** - Track job applications
- **Skill Gap Analysis** - Identify areas for improvement
- **Activity Feed** - Recent actions and updates

### 👤 Dynamic Profile Management
- **Real-time Editing** - Live updates without page refresh
- **Avatar Upload** - Custom profile pictures
- **Social Links Integration** - GitHub, LinkedIn, Portfolio
- **Skills & Goals Tracking** - Interactive progress bars

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.2
- **Styling:** Tailwind CSS 3.3
- **UI Components:** Shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **State Management:** React Hooks + Context API

### Backend
- **API Routes:** Next.js API Routes
- **Database:** PostgreSQL (Neon DB)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **AI Integration:** Google Gemini API

### DevOps & Tools
- **Deployment:** Vercel
- **Version Control:** Git
- **Package Manager:** npm
- **Code Quality:** ESLint, TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (or Neon DB account)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MARK1-main-main.git
   cd MARK1-main-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
   
   # AI Service
   GEMINI_API_KEY="your-gemini-api-key"
   
   # Authentication
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Setup

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT token secret | `your-secret-key` |

### Getting API Keys

**Google Gemini API:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste into `.env.local`

**Neon Database:**
1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env.local` as `DATABASE_URL`

---

## 📁 Project Structure

```
MARK1-main-main/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── coach/          # AI coach endpoint
│   │   └── resume/         # Resume operations
│   ├── auth/               # Auth pages (signin, signup)
│   ├── coach/              # AI Coach page
│   ├── dashboard/          # Dashboard page
│   ├── profile/            # User profile page
│   ├── resume/             # Resume builder page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/              # React Components
│   ├── ui/                 # Shadcn/ui components
│   ├── layout/             # Layout components (Navbar, etc.)
│   ├── resume/             # Resume builder components
│   ├── dashboard/          # Dashboard components
│   └── charts/             # Chart components
│
├── lib/                     # Utility functions
│   ├── ai-service.ts       # AI integration
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts               # Database client
│   ├── resume-export.ts    # Export functionality
│   └── utils.ts            # Helper functions
│
├── hooks/                   # Custom React Hooks
│   ├── useAISuggestions.ts
│   ├── useATSScore.ts
│   ├── useResumeExport.ts
│   └── useVersionHistory.ts
│
├── prisma/                  # Database Schema
│   └── schema.prisma
│
├── public/                  # Static assets
├── styles/                  # Global styles
└── middleware.ts            # Next.js middleware
```

---

## 🎯 Key Features Explained

### ATS Scoring Algorithm

The platform includes a sophisticated ATS (Applicant Tracking System) scoring algorithm that evaluates:

- **Keywords Match** (25%) - Industry-relevant keywords
- **Format Optimization** (20%) - Standard formatting
- **Contact Information** (15%) - Complete contact details
- **Achievement Quantification** (20%) - Measurable results
- **Section Completeness** (10%) - All required sections
- **Experience Quality** (10%) - Detailed descriptions

**Score Ranges:**
- 90-100: Excellent ✅
- 70-89: Good ⚠️
- Below 70: Needs Improvement ❌

### AI Integration

Uses Google Gemini 2.5 Flash for:
- Resume content suggestions
- Career advice and coaching
- Interview question generation
- Skills gap analysis
- Career path recommendations

### Version History

Automatic versioning system that:
- Saves every resume edit
- Allows restoration to previous versions
- Shows diff comparisons
- Maintains 50 versions per resume

---

## 📡 API Documentation

### Authentication

```typescript
POST /api/auth/signup
Body: { firstName, lastName, email, password }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

POST /api/auth/logout
Response: { success: true }
```

### AI Coach

```typescript
POST /api/coach
Body: { 
  message: string,
  context?: {
    resumeData?: Resume,
    conversationHistory?: Message[]
  }
}
Response: { 
  response: string,
  suggestions?: string[]
}
```

### Resume Operations

```typescript
GET /api/resume
Response: { resumes: Resume[] }

POST /api/resume
Body: { resumeData: Resume }
Response: { resume: Resume }

PUT /api/resume/:id
Body: { resumeData: Partial<Resume> }
Response: { resume: Resume }

DELETE /api/resume/:id
Response: { success: true }
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables
   - Click "Deploy"

3. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy if needed

### Custom Domain Setup

1. Go to Vercel project settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Google Gemini](https://ai.google.dev/) - AI integration
- [Vercel](https://vercel.com/) - Hosting platform
- [Neon](https://neon.tech/) - Serverless PostgreSQL

---

## 📞 Support

- **Documentation:** [PROJECT_REPORT.md](PROJECT_REPORT.md)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/MARK1-main-main/issues)
- **Email:** your-email@example.com

---

<div align="center">

**Built with ❤️ by [Your Name]**

⭐ Star this repo if you find it helpful!

</div>
