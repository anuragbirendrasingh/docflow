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
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-hover hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer"
    >
      {/* Header row: title + menu */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col flex-1 truncate">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-xl transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1.5">
            {doc.title || 'Untitled Document'}
          </h3>
          <p className="text-sm font-semibold text-slate-500">
            {formatDate(doc.updatedAt)}
          </p>
        </div>

        {/* Three-dot menu button */}
        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuToggle}
            className="rounded-full p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
          >
            <MoreVertical className="h-6 w-6" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={handleRename}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Pencil className="h-5 w-5 text-slate-400" />
                Rename
              </button>
              <button
                onClick={handleShare}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5 text-slate-400" />
                Share
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 transition-colors mt-1"
                >
                  <Trash2 className="h-5 w-5 text-red-400" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
        {/* Badge */}
        <Badge variant={isOwner ? 'owner' : 'shared'}>
          {isOwner ? 'Owner' : 'Shared'}
        </Badge>
        
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
          <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
             {doc.title ? doc.title.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
      </div>
    </div>
  );
}
