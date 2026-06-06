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

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { ownedDocs, sharedDocs, loading: docsLoading, refetch } = useDocuments();
  const router = useRouter();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-indigo-600">DocFlow</h1>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Action bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <CreateDocumentButton />
          <Button
            variant="secondary"
            size="md"
            onClick={() => setUploadModalOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Document list */}
        <DocumentList
          ownedDocs={ownedDocs}
          sharedDocs={sharedDocs}
          loading={docsLoading}
          onRefetch={refetch}
        />
      </main>

      {/* File upload modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
