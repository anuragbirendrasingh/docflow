'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, File, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { createDocument, updateDocumentContent, updateDocumentTitle } from '@/lib/firestore';
import { parseFile } from '@/lib/fileParser';

const ACCEPTED_TYPES = ['.txt', '.md', '.docx'];
const ACCEPT_STRING = '.txt,.md,.docx';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUploadModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const resetState = () => {
    setSelectedFile(null);
    setIsDragging(false);
    setUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      toast.error(`Unsupported file type. Please upload ${ACCEPTED_TYPES.join(', ')} files.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Parse file contents
      const content = await parseFile(selectedFile);

      // Create a new document
      const newDocId = await createDocument(user.uid, user.email);

      // Set the title from the filename
      const title = selectedFile.name.replace(/\.[^/.]+$/, '');
      await updateDocumentTitle(newDocId, title);

      // Update document with parsed content
      await updateDocumentContent(newDocId, content);

      toast.success('File imported successfully!');
      handleClose();
      router.push(`/document/${newDocId}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to import file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import File">
      <div className="space-y-4">
        {/* Drag and drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center rounded-xl border-2 border-dashed
            px-6 py-10 text-center cursor-pointer transition-colors
            ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
          `}
        >
          <Upload className="mb-3 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Drag & drop a file here or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: .txt, .md, .docx
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Selected file preview */}
        {selectedFile && (
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Upload button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} size="md">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            size="md"
            loading={uploading}
            disabled={!selectedFile}
          >
            <Upload className="h-4 w-4" />
            Upload & Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
