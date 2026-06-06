'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDocument,
  updateDocumentContent,
  updateDocumentTitle,
} from '@/lib/firestore';

/**
 * Hook for single document fetch + auto-save with debounce.
 * @param {string} documentId - The document ID to fetch
 * @returns {{ document: import('@/types').Document | null, loading: boolean, saving: boolean, saveStatus: 'saved'|'saving'|'error'|'idle', saveContent: (content: string) => Promise<void>, saveTitle: (title: string) => Promise<void>, setDocument: Function }}
 */
export function useDocument(documentId) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDocument() {
      try {
        setLoading(true);
        const doc = await getDocument(documentId);

        if (!cancelled) {
          setDocument(doc);
          setSaveStatus(doc ? 'saved' : 'idle');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        if (!cancelled) {
          setDocument(null);
          setSaveStatus('error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDocument();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const saveContent = useCallback(
    async (content) => {
      if (!documentId) return;

      try {
        setSaving(true);
        setSaveStatus('saving');
        await updateDocumentContent(documentId, content);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving document content:', error);
        setSaveStatus('error');
      } finally {
        setSaving(false);
      }
    },
    [documentId]
  );

  const saveTitle = useCallback(
    async (title) => {
      if (!documentId) return;

      try {
        setSaving(true);
        setSaveStatus('saving');
        await updateDocumentTitle(documentId, title);
        setDocument((prev) =>
          prev ? { ...prev, title } : prev
        );
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving document title:', error);
        setSaveStatus('error');
      } finally {
        setSaving(false);
      }
    },
    [documentId]
  );

  return {
    document,
    loading,
    saving,
    saveStatus,
    saveContent,
    saveTitle,
    setDocument,
  };
}
