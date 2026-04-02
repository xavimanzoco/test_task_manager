import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage your team tasks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
        </nav>
        {children}
      </body>
    </html>
  );
}
