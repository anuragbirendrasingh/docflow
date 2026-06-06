'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';

function parseContent(content) {
  if (!content) return { type: 'doc', content: [{ type: 'paragraph' }] };
  try { return JSON.parse(content); } catch { return { type: 'doc', content: [{ type: 'paragraph' }] }; }
}

const editorStyles = `
  .ProseMirror {
    outline: none;
    min-height: 70vh;
    color: #0f172a;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 1.05rem;
    line-height: 1.7;
  }
  .dark .ProseMirror {
    color: #f1f5f9;
  }
  .ProseMirror p {
    margin-bottom: 1.25rem;
  }
  .ProseMirror h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.2;
    color: #0f172a;
    letter-spacing: -0.025em;
  }
  .dark .ProseMirror h1 {
    color: #ffffff;
  }
  .ProseMirror h1:first-child {
    margin-top: 0;
  }
  .ProseMirror h2 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    color: #1e293b;
    letter-spacing: -0.015em;
  }
  .dark .ProseMirror h2 {
    color: #e2e8f0;
  }
  .ProseMirror h3 {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    color: #334155;
  }
  .dark .ProseMirror h3 {
    color: #cbd5e1;
  }
  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }
  .ProseMirror ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }
  .ProseMirror li {
    margin-bottom: 0.5rem;
  }
  .ProseMirror blockquote {
    border-left: 4px solid #cbd5e1;
    padding-left: 1.25rem;
    color: #475569;
    font-style: italic;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    background: #f8fafc;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }
  .dark .ProseMirror blockquote {
    border-color: #334155;
    color: #94a3b8;
    background: #0f172a;
  }
  .ProseMirror code {
    background: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 0.375rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875em;
    color: #db2777;
  }
  .dark .ProseMirror code {
    background: #1e293b;
    color: #f472b6;
  }
  .ProseMirror pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  }
  .dark .ProseMirror pre {
    background: #000000;
  }
  .ProseMirror pre code {
    background: none;
    padding: 0;
    border-radius: 0;
    color: inherit;
    font-size: 0.875em;
  }
  .ProseMirror mark {
    background: #fef08a;
    padding: 0.15rem 0.25rem;
    border-radius: 0.25rem;
  }
  .dark .ProseMirror mark {
    background: #713f12;
    color: #fef9c3;
  }
  .ProseMirror hr {
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 2.5rem 0;
  }
  .dark .ProseMirror hr {
    border-color: #1e293b;
  }
  .ProseMirror .is-editor-empty:first-child::before {
    color: #94a3b8;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  .dark .ProseMirror .is-editor-empty:first-child::before {
    color: #475569;
  }
`;

export default function TiptapEditor({ content, onUpdate, editable = true }) {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Typography,
      Placeholder.configure({ placeholder: 'Start typing your document...' }),
    ],
    content: parseContent(content),
    editable,
    onUpdate: ({ editor: editorInstance }) => {
      if (onUpdate) onUpdate(JSON.stringify(editorInstance.getJSON()));
    },
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <div className="w-full pb-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <EditorToolbar editor={editor} />
          <div className="px-8 sm:px-16 md:px-24 py-12 md:py-16 min-h-[70vh]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  );
}
