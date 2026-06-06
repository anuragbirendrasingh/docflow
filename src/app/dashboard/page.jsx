'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import Button from '@/components/ui/Button';
import CreateDocumentButton from '@/components/dashboard/CreateDocumentButton';
import DocumentList from '@/components/dashboard/DocumentList';
import FileUploadModal from '@/components/dashboard/FileUploadModal';
import ShareModal from '@/components/editor/ShareModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { ownedDocs, sharedDocs, loading: docsLoading, refetch } = useDocuments();
  const router = useRouter();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [docToShare, setDocToShare] = useState(null);

  const handleShareClick = (doc) => {
    setDocToShare(doc);
    setShareModalOpen(true);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  // Show loading spinner while auth is being resolved
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 sm:px-12 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-soft">
              <span className="font-display text-xl font-bold">D</span>
            </div>
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              DocFlow
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{user.email?.split('@')[0]}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
            </div>
            <ThemeToggle />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-full px-4">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 sm:px-12 py-12 md:py-16">
        {/* Action bar */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">My Workspace</h2>
            <p className="text-slate-600 dark:text-slate-400">Create, edit, and manage your documents.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setUploadModalOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            <CreateDocumentButton />
          </div>
        </div>

        <DocumentList
          ownedDocs={ownedDocs}
          sharedDocs={sharedDocs}
          loading={docsLoading}
          onRefetch={refetch}
          onShare={handleShareClick}
        />
      </main>

      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* Share modal for dashboard */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setDocToShare(null);
        }}
        document={docToShare}
        onShareUpdate={refetch}
        currentUserId={user.uid}
      />
    </div>
  );
}
