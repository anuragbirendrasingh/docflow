'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import DocumentCard from '@/components/dashboard/DocumentCard';
import { updateDocumentTitle, deleteDocument } from '@/lib/firestore';

export default function DocumentList({ ownedDocs, sharedDocs, loading, onRefetch, onShare }) {
  const [activeTab, setActiveTab] = useState('owned');

  const docs = activeTab === 'owned' ? ownedDocs : sharedDocs;
  const isOwnerTab = activeTab === 'owned';

  const handleRename = async (doc) => {
    const newTitle = prompt('Enter new document title:', doc.title || 'Untitled Document');
    if (!newTitle || newTitle.trim() === '') return;

    try {
      await updateDocumentTitle(doc.id, newTitle.trim());
      toast.success('Document renamed successfully');
      onRefetch?.();
    } catch (error) {
      console.error('Error renaming document:', error);
      toast.error('Failed to rename document');
    }
  };

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${doc.title || 'Untitled Document'}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDocument(doc.id);
      toast.success('Document deleted successfully');
      onRefetch?.();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleShare = (doc) => {
    if (onShare) {
      onShare(doc);
    } else {
      toast('Share feature coming soon', { icon: '🔗' });
    }
  };

  // Skeleton loading cards
  if (loading) {
    return (
      <div className="animate-pulse">
        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="h-11 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-11 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 mt-8">
      {/* Tabs */}
      <div className="mb-12 flex space-x-4 sm:space-x-6 border-b border-slate-200 dark:border-slate-800 pb-5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('owned')}
          className={`flex items-center gap-3 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
            activeTab === 'owned'
              ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-primary-500/50'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-300 dark:hover:ring-slate-600 hover:-translate-y-0.5'
          }`}
        >
          My Documents
          <span
            className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
              activeTab === 'owned'
                ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-800 dark:text-primary-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {ownedDocs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex items-center gap-3 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
            activeTab === 'shared'
              ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-primary-500/50'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-300 dark:hover:ring-slate-600 hover:-translate-y-0.5'
          }`}
        >
          Shared with Me
          {sharedDocs.length > 0 && (
            <span
              className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                activeTab === 'shared'
                  ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-800 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sharedDocs.length}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      {docs.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isOwner={isOwnerTab}
              onRename={handleRename}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <FileText className="mb-4 h-16 w-16 text-slate-400 dark:text-slate-700" />
          <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-300">
            {isOwnerTab ? 'No documents yet' : 'No shared documents'}
          </h3>
          <p className="mb-6 max-w-sm text-slate-500">
            {isOwnerTab
              ? "You haven't created any documents yet. Start writing by creating your first document."
              : 'Documents that others share with you will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
}
