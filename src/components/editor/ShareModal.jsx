'use client';

import { useState } from 'react';
import { UserPlus, Loader2, Trash2 } from 'lucide-react';
import { getUserByEmail, shareDocument, removeShare } from '@/lib/firestore';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document">
      <div className="space-y-6">
        {/* Share Form */}
        <form onSubmit={handleShare} className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Input
                id="share-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="user@example.com"
                disabled={sharing}
                error={error}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={sharing || !email.trim()}
              loading={sharing}
              className="mt-1"
            >
              <UserPlus className="w-4 h-4" />
              Share
            </Button>
          </div>
        </form>

        {/* Shared Users List */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Shared with ({sharedUsers.length})
          </h3>

          {sharedUsers.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400">
                This document hasn't been shared with anyone yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sharedUsers.map((sharedEmail) => (
                <li
                  key={sharedEmail}
                  className="flex items-center justify-between py-2.5 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                    {sharedEmail}
                  </span>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemoveShare(sharedEmail)}
                      disabled={removingEmail === sharedEmail}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Document Owner</span>
          <span className="text-xs font-medium text-primary-400 bg-primary-900/30 px-2 py-1 rounded-md border border-primary-800">
            {doc.ownerEmail}
          </span>
        </div>
      </div>
    </Modal>
  );
}
