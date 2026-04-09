'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          Tracksy AI- Job Application Tracker
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/applications" className="text-slate-300 hover:text-white transition-colors">
            Applications
          </Link>
          <Link href="/dashboard/resume" className="text-slate-300 hover:text-white transition-colors">
            Resume
          </Link>
        </nav>

        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-800 p-4 space-y-3">
          <Link
            href="/dashboard"
            className="block text-slate-300 hover:text-white transition-colors p-2"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/applications"
            className="block text-slate-300 hover:text-white transition-colors p-2"
          >
            Applications
          </Link>
          <Link
            href="/dashboard/resume"
            className="block text-slate-300 hover:text-white transition-colors p-2"
          >
            Resume
          </Link>
          <Button
            onClick={handleLogout}
            className="w-full text-left justify-start"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
