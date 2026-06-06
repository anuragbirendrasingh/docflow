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
      <div className="space-y-5">
        {/* Drag and drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            px-8 py-16 text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
                : 'border-slate-300 dark:border-slate-700 hover:border-primary-500 bg-slate-50 dark:bg-slate-800/50'
            }
          `}
        >
          <div className="rounded-full bg-white dark:bg-slate-900 p-4 shadow-sm mb-6 border border-slate-200 dark:border-slate-700">
            <Upload className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-200">
            Drag & drop a file here or click to browse
          </p>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
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
          <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-5 py-4 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/50 p-2 border border-primary-200 dark:border-primary-800">
                <File className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate max-w-[220px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="rounded-full p-2.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Upload button */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" onClick={handleClose} size="lg">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            size="lg"
            loading={uploading}
            disabled={!selectedFile}
          >
            <Upload className="h-5 w-5" />
            Upload & Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
