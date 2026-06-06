'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary-100/50 dark:bg-primary-900/20 blur-3xl opacity-50" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-3xl opacity-50" />
      </div>

      <div className="z-10 text-center max-w-4xl px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-8 ring-1 ring-primary-500/20 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
          DocFlow is now in Beta
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          The simple, beautiful way to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">
            write together.
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Create, edit, and share documents in a lightning-fast workspace designed for pure focus.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full text-lg font-bold transition-all shadow-soft hover:shadow-hover hover:-translate-y-1 ring-4 ring-primary-50 dark:ring-primary-900/30"
          >
            Get Started for Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-lg font-bold transition-all shadow-soft hover:shadow-hover hover:-translate-y-1 ring-1 ring-slate-200 dark:ring-slate-800"
          >
            Log in to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
