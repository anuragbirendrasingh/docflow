'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { UserPlus, Loader2, FileText } from 'lucide-react';
import Input from '@/components/ui/Input';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFirebaseErrorMessage(err) {
  const errorCode = err?.code;
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Account creation is currently disabled. Contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return err?.message || 'An error occurred during sign up. Please try again.';
  }
}

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  function validate() {
    if (!name.trim()) {
      return 'Please enter your full name.';
    }

    if (!email.trim()) {
      return 'Please enter your email address.';
    }

    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Please enter a password.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name.trim());
      router.push('/dashboard');
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600 mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DocFlow</h1>
          <p className="mt-2 text-gray-500">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
            {/* Name Field */}
            <Input
              id="name"
              type="text"
              label="Full name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anurag"
            />

            {/* Email Field */}
            <Input
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anurag@mail.com"
            />

            {/* Password Field */}
            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 text-sm leading-snug">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
