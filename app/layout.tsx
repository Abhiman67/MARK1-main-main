import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster), { ssr: false });

export const metadata: Metadata = {
  title: 'AI Career Coach - Your Personalized Career Development Platform',
  description: 'Transform your career with AI-powered coaching, interactive roadmaps, and intelligent resume building. Get personalized guidance for your professional journey.',
  keywords: 'career coaching, AI career advice, resume builder, career roadmap, professional development',
  authors: [{ name: 'AI Career Coach Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#333',
                },
              }}
            />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}