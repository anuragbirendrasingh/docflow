# Architecture Decisions

## Why Next.js App Router?
Next.js provides an excellent balance of server-side capability and client-side interactivity. The App Router allows for easy layout composition and clean, directory-based routing, which fits perfectly with the dashboard/editor pattern.

## Why Firebase?
Firebase gives an entire backend-as-a-service ecosystem:
- **Auth**: Handles complex password management and sessions seamlessly.
- **Firestore**: Provides real-time synchronization capabilities and document storage out of the box, avoiding the need for a separate database and API layer.

## Why Tiptap?
Tiptap is a headless wrapper around ProseMirror. It gives absolute control over the editor's UI (unlike full-packaged editors) while providing rock-solid content management through its JSON-based structure. It makes parsing and saving predictable.

## Data Model
- **documents collection**: Stores the actual document contents, including `title`, `content` (stringified Tiptap JSON), `ownerId`, `ownerEmail`, `sharedWith` array, and `sharedWithIds` array.
- **users collection**: Stores basic user profiles to map emails to display names and UIDs, essential for the sharing functionality.

## Sharing Model & Access Control
Access is controlled via Firestore Security Rules:
- A user can **read/write** a document if they are the owner (`ownerId == request.auth.uid`) OR if their email is in the `sharedWith` array.
- A user can only **delete** a document if they are the owner.
- The UI reflects this by hiding the Share/Delete options from non-owners and displaying visual badges ("Owner" vs "Shared").

## Auto-save Architecture
Instead of saving on every keystroke (which would spam Firestore and incur high costs), we use a **1500ms debounce** approach. A timer resets on every edit. Once the user stops typing for 1.5 seconds, the content is stringified and pushed to Firestore.

## File Parsing Strategy
- `.txt` / `.md`: Read client-side using `FileReader`, split by newlines, and mapped directly into Tiptap paragraph JSON nodes.
- `.docx`: We utilize `mammoth` to extract raw text from the ArrayBuffer, completely client-side, keeping the architecture purely serverless and avoiding heavy backend processing.

## Prioritizations
- **Prioritized**: A fast, reliable rich-text editor and secure sharing system.
- **Left out**: Real-time collaborative cursors (e.g., Yjs). Setting up a WebSocket or WebRTC signaling server for Yjs adds significant complexity and wasn't strictly required for a "mini" version. Firestore real-time listeners could be added later for basic live-updates.
