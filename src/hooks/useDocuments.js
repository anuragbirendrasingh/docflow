'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserDocuments, getSharedDocuments } from '@/lib/firestore';

export function useDocuments() {
  const { user } = useAuth();
  const [ownedDocs, setOwnedDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) {
      setOwnedDocs([]);
      setSharedDocs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [owned, shared] = await Promise.all([
        getUserDocuments(user.uid),
        getSharedDocuments(user.email),
      ]);
      setOwnedDocs(owned);
      setSharedDocs(shared);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const refetch = useCallback(() => {
    return fetchDocuments();
  }, [fetchDocuments]);

  return { ownedDocs, sharedDocs, loading, refetch };
}
