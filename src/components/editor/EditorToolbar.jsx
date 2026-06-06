'use client';

import {
  Bold, Italic, Underline, Strikethrough, Highlighter,
  Pilcrow, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  TextQuote, Code, Minus
} from 'lucide-react';

function ToolbarButton({ onClick, isActive, disabled, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
        isActive
          ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-lg">
      {children}
    </div>
  );
}

export default function EditorToolbar({ editor }) {
  if (!editor) return null;
  const isEditable = editor.isEditable;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center gap-4 rounded-t-2xl">
      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} disabled={!isEditable} title="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} disabled={!isEditable} title="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} disabled={!isEditable} title="Underline"><Underline className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} disabled={!isEditable} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} disabled={!isEditable} title="Highlight"><Highlighter className="w-4 h-4" /></ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} disabled={!isEditable} title="Heading 1"><span className="text-sm font-bold w-4 h-4 flex items-center justify-center leading-none">H1</span></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} disabled={!isEditable} title="Heading 2"><span className="text-sm font-bold w-4 h-4 flex items-center justify-center leading-none">H2</span></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} disabled={!isEditable} title="Heading 3"><span className="text-sm font-bold w-4 h-4 flex items-center justify-center leading-none">H3</span></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} disabled={!isEditable} title="Paragraph"><Pilcrow className="w-4 h-4" /></ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} disabled={!isEditable} title="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} disabled={!isEditable} title="Ordered List"><ListOrdered className="w-4 h-4" /></ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} disabled={!isEditable} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} disabled={!isEditable} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} disabled={!isEditable} title="Align Right"><AlignRight className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} disabled={!isEditable} title="Justify"><AlignJustify className="w-4 h-4" /></ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} disabled={!isEditable} title="Blockquote"><TextQuote className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} disabled={!isEditable} title="Code Block"><Code className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} disabled={!isEditable} title="Horizontal Rule"><Minus className="w-4 h-4" /></ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
