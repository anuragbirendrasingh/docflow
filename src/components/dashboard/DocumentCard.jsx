'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Share2, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DocumentCard({ doc, isOwner, onRename, onDelete, onShare }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleCardClick = () => {
    router.push(`/document/${doc.id}`);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onRename?.(doc);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onShare?.(doc);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(doc);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Header row: title + menu */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate flex-1">
          {doc.title || 'Untitled Document'}
        </h3>

        {/* Three-dot menu button */}
        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuToggle}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={handleRename}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Rename
              </button>
              <button
                onClick={handleShare}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Date */}
      <p className="mt-2 text-sm text-gray-500">
        Last updated: {formatDate(doc.updatedAt)}
      </p>

      {/* Badge */}
      <div className="mt-3">
        <Badge variant={isOwner ? 'owner' : 'shared'}>
          {isOwner ? 'Owner' : 'Shared'}
        </Badge>
      </div>
    </div>
  );
}
