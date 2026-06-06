'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { createDocument } from '@/lib/firestore';
import Button from '@/components/ui/Button';

export default function CreateDocumentButton() {
  const { user } = useAuth();
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!user) {
      toast.error('You must be logged in to create a document');
      return;
    }

    setCreating(true);
    try {
      const newDocId = await createDocument(user.uid, user.email);
      router.push(`/document/${newDocId}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Button
      onClick={handleCreate}
      variant="primary"
      size="md"
      loading={creating}
    >
      <Plus className="h-4 w-4" />
      New Document
    </Button>
  );
}
