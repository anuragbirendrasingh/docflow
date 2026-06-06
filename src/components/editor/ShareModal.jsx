'use client';

import { useState } from 'react';
import { X, UserPlus, Loader2, Trash2 } from 'lucide-react';
import { getUserByEmail, shareDocument, removeShare } from '@/lib/firestore';
import toast from 'react-hot-toast';

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Share modal for sharing documents with other users.
 * @param {{ isOpen: boolean, onClose: () => void, document: import('@/types').Document | null, onShareUpdate: () => void, currentUserId: string }} props
 */
export default function ShareModal({
  isOpen,
  onClose,
  document: doc,
  onShareUpdate,
  currentUserId,
}) {
  const [email, setEmail] = useState('');
  const [sharing, setSharing] = useState(false);
  const [removingEmail, setRemovingEmail] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen || !doc) return null;

  const isOwner = doc.ownerId === currentUserId;

  async function handleShare(e) {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter an email address.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (trimmedEmail === doc.ownerEmail) {
      setError('You cannot share a document with yourself.');
      return;
    }

    if (doc.sharedWith && doc.sharedWith.includes(trimmedEmail)) {
      setError('This document is already shared with this user.');
      return;
    }

    try {
      setSharing(true);

      const user = await getUserByEmail(trimmedEmail);

      if (!user) {
        setError('No account found with this email.');
        return;
      }

      await shareDocument(doc.id, trimmedEmail, user.uid);

      toast.success(`Document shared with ${trimmedEmail}`);
      setEmail('');
      setError('');

      if (onShareUpdate) {
        onShareUpdate();
      }
    } catch (err) {
      console.error('Error sharing document:', err);
      setError('Failed to share document. Please try again.');
    } finally {
      setSharing(false);
    }
  }

  async function handleRemoveShare(emailToRemove) {
    try {
      setRemovingEmail(emailToRemove);

      // Look up the user UID to pass to removeShare
      const userToRemove = await getUserByEmail(emailToRemove);
      const uidToRemove = userToRemove ? userToRemove.uid : '';

      await removeShare(doc.id, emailToRemove, uidToRemove);
      toast.success(`Removed access for ${emailToRemove}`);

      if (onShareUpdate) {
        onShareUpdate();
      }
    } catch (err) {
      console.error('Error removing share:', err);
      toast.error('Failed to remove access. Please try again.');
    } finally {
      setRemovingEmail(null);
    }
  }

  const sharedUsers = doc.sharedWith || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Share Document</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Form */}
        <form onSubmit={handleShare} className="mb-6">
          <label
            htmlFor="share-email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Enter email address to share with
          </label>
          <div className="flex gap-2">
            <input
              id="share-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="user@example.com"
              className="flex-1 px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={sharing}
            />
            <button
              type="submit"
              disabled={sharing || !email.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {sharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Share
            </button>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </form>

        {/* Shared Users List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Shared with ({sharedUsers.length})
          </h3>

          {sharedUsers.length === 0 ? (
            <p className="text-sm text-gray-400 py-3 text-center">
              This document hasn&apos;t been shared with anyone yet.
            </p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {sharedUsers.map((sharedEmail) => (
                <li
                  key={sharedEmail}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700 truncate">
                    {sharedEmail}
                  </span>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemoveShare(sharedEmail)}
                      disabled={removingEmail === sharedEmail}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                      title={`Remove access for ${sharedEmail}`}
                    >
                      {removingEmail === sharedEmail ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Owner info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Owner: {doc.ownerEmail}
          </p>
        </div>
      </div>
    </div>
  );
}
