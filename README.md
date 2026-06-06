# DocFlow

DocFlow is a modern, fast, and collaborative document editor, a mini Google Docs clone built to provide an excellent writing and collaboration experience.

## Features
- **Rich Text Editing**: Powered by Tiptap with full formatting capabilities (bold, italic, headings, alignment, lists, and more).
- **Auto-save**: Edits are automatically saved as you type.
- **Collaboration & Sharing**: Share documents with others via their email address.
- **File Parsing**: Upload and parse `.txt`, `.md`, and `.docx` files into the editor.
- **Authentication**: Fully integrated user accounts via Firebase Auth.
- **Dashboard**: Keep track of "My Documents" and "Shared with Me" files easily.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript / JSX
- **Styling**: Tailwind CSS v4
- **Editor**: Tiptap (StarterKit, Underline, TextAlign, Highlight, Typography, Placeholder)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (Email/Password)
- **File Parsing**: Mammoth (for `.docx`), native for `.txt`/`.md`
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel ready

## Prerequisites
- Node.js 18+ and npm
- A Firebase Project (with Authentication and Firestore enabled)

## Local Setup

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd docflow
   npm install
   ```

2. **Configure Firebase**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password provider).
   - Enable **Firestore Database** and use the rules provided in `firestore.rules`.
   - Copy the `.env.local.example` file to `.env.local` and add your Firebase credentials.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests
To run the file parser automated tests:
```bash
npm test
```

## Supported File Upload Types
- `.txt` (Plain text)
- `.md` (Markdown, parsed as text lines)
- `.docx` (Microsoft Word documents)

## Test Credentials
For review purposes, you can use these accounts if created in the system, or just sign up with any test emails:
- **Test User 1**: `user1@example.com` / `password123`
- **Test User 2**: `user2@example.com` / `password123`

## Live Deployment
[ADD YOUR VERCEL URL HERE]
