import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Manage with precision',
  description: 'High-performance task management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">TaskFlow</span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}