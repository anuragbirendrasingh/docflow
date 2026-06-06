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
      <div>
        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-gray-200">
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('owned')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'owned'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Documents
          {ownedDocs.length > 0 && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {ownedDocs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'shared'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Shared with Me
          {sharedDocs.length > 0 && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {sharedDocs.length}
            </span>
          )}
        </button>
      </div>

      {/* Document grid or empty state */}
      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {isOwnerTab ? 'No documents yet' : 'No shared documents'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isOwnerTab
              ? 'Create your first document to get started.'
              : 'Documents shared with you will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </div>
  );
}
