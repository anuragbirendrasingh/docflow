'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Loader2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocument } from '@/hooks/useDocument';
import TiptapEditor from '@/components/editor/TiptapEditor';
import ShareModal from '@/components/editor/ShareModal';
import { getDocument } from '@/lib/firestore';
import ThemeToggle from '@/components/ui/ThemeToggle';

const AUTO_SAVE_DELAY = 1500;

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const {
    document: doc,
    loading: docLoading,
    saveStatus,
    saveContent,
    saveTitle,
    setDocument,
  } = useDocument(documentId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Debounce timer ref for auto-save
  const saveTimerRef = useRef(null);

  // Sync title value when document loads
  useEffect(() => {
    if (doc?.title) {
      setTitleValue(doc.title);
    }
  }, [doc?.title]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  /**
   * Handle editor content update with debounced auto-save.
   */
  const handleEditorUpdate = useCallback(
    (content) => {
      // Clear any existing save timer
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Set new debounce timer
      saveTimerRef.current = setTimeout(() => {
        saveContent(content);
      }, AUTO_SAVE_DELAY);
    },
    [saveContent]
  );

  /**
   * Handle title edit submission.
   */
  function handleTitleSubmit() {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== doc?.title) {
      saveTitle(trimmed);
    } else {
      setTitleValue(doc?.title || '');
    }
    setIsEditingTitle(false);
  }

  /**
   * Handle title input key events.
   */
  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    }
    if (e.key === 'Escape') {
      setTitleValue(doc?.title || '');
      setIsEditingTitle(false);
    }
  }

  /**
   * Refresh document data after share updates.
   */
  async function handleShareUpdate() {
    try {
      const freshDoc = await getDocument(documentId);
      if (freshDoc) {
        setDocument(freshDoc);
      }
    } catch (err) {
      console.error('Error refreshing document after share:', err);
    }
  }

  /**
   * Render the auto-save status indicator.
   */
  function renderSaveStatus() {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
            <Check className="w-3.5 h-3.5" />
            Saved ✓
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            Error saving
          </span>
        );
      default:
        return null;
    }
  }

  // Show nothing while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Redirect handled by useEffect, but prevent rendering
  if (!user) {
    return null;
  }

  // Loading state while fetching document
  if (docLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading document...</p>
        </div>
      </div>
    );
  }

  // Document not found or access denied
  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Document not found
          </h1>
          <p className="text-gray-500 mb-6">
            This document doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwner = doc.ownerId === user.uid;
  const isSharedDoc = !isOwner;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Bar */}
      <header className="bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Editable Title */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  className="w-full text-xl font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-primary-500 outline-none px-1 py-0.5"
                />
              ) : (
                <h1
                  onClick={() => {
                    if (isOwner) {
                      setTitleValue(doc.title || '');
                      setIsEditingTitle(true);
                    }
                  }}
                  className={`text-xl font-bold text-slate-900 dark:text-slate-100 truncate ${
                    isOwner
                      ? 'cursor-text hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors'
                      : ''
                  }`}
                  title={isOwner ? 'Click to edit title' : doc.title}
                >
                  {doc.title || 'Untitled Document'}
                </h1>
              )}
            </div>
          </div>

          {/* Right: Status + Share Info + Share Button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Save Status */}
            {renderSaveStatus()}

            {/* Shared Doc Info */}
            {isSharedDoc && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap hidden sm:inline-block">
                Shared by {doc.ownerEmail}
              </span>
            )}

            <ThemeToggle />

            {/* Share Button */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-500 shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="py-12 px-6 max-w-7xl mx-auto w-full">
        <TiptapEditor
          content={doc.content}
          onUpdate={handleEditorUpdate}
          editable={true}
        />
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        document={doc}
        onShareUpdate={handleShareUpdate}
        currentUserId={user.uid}
      />
    </div>
  );
}
