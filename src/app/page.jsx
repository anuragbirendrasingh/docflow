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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-indigo-600">DocFlow</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          A modern, fast, and collaborative document editor. Create, edit, and share documents with ease. Built with Next.js, Firebase, and Tiptap.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
