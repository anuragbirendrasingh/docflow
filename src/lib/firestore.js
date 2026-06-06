import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates a new document with default values.
 * @param {string} ownerId - The UID of the document owner.
 * @param {string} ownerEmail - The email of the document owner.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createDocument(ownerId, ownerEmail) {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      title: 'Untitled Document',
      content: '{}',
      ownerId,
      ownerEmail,
      sharedWith: [],
      sharedWithIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

/**
 * Fetches a single document by its ID.
 * @param {string} docId - The document ID to fetch.
 * @returns {Promise<import('../types/index').Document|null>} The document data or null if not found.
 */
export async function getDocument(docId) {
  try {
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
}

/**
 * Updates the content of a document.
 * @param {string} docId - The document ID to update.
 * @param {string} content - The new content string (stringified Tiptap JSON).
 * @returns {Promise<void>}
 */
export async function updateDocumentContent(docId, content) {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      content,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating document content:', error);
    throw error;
  }
}

/**
 * Updates the title of a document.
 * @param {string} docId - The document ID to update.
 * @param {string} title - The new title.
 * @returns {Promise<void>}
 */
export async function updateDocumentTitle(docId, title) {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      title,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating document title:', error);
    throw error;
  }
}

/**
 * Deletes a document by its ID.
 * @param {string} docId - The document ID to delete.
 * @returns {Promise<void>}
 */
export async function deleteDocument(docId) {
  try {
    const docRef = doc(db, 'documents', docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Gets all documents owned by a specific user, ordered by updatedAt descending.
 * @param {string} userId - The UID of the document owner.
 * @returns {Promise<import('../types/index').Document[]>} Array of documents.
 */
export async function getUserDocuments(userId) {
  try {
    const q = query(
      collection(db, 'documents'),
      where('ownerId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
}

/**
 * Gets all documents shared with a specific user email.
 * @param {string} userEmail - The email of the user.
 * @returns {Promise<import('../types/index').Document[]>} Array of shared documents.
 */
export async function getSharedDocuments(userEmail) {
  try {
    const q = query(
      collection(db, 'documents'),
      where('sharedWith', 'array-contains', userEmail)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    throw error;
  }
}

/**
 * Shares a document with a user by adding their email and UID.
 * @param {string} docId - The document ID to share.
 * @param {string} email - The email of the user to share with.
 * @param {string} uid - The UID of the user to share with.
 * @returns {Promise<void>}
 */
export async function shareDocument(docId, email, uid) {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      sharedWith: arrayUnion(email),
      sharedWithIds: arrayUnion(uid),
    });
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
}

/**
 * Removes sharing access for a user from a document.
 * @param {string} docId - The document ID to unshare.
 * @param {string} email - The email of the user to remove.
 * @param {string} uid - The UID of the user to remove.
 * @returns {Promise<void>}
 */
export async function removeShare(docId, email, uid) {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      sharedWith: arrayRemove(email),
      sharedWithIds: arrayRemove(uid),
    });
  } catch (error) {
    console.error('Error removing share:', error);
    throw error;
  }
}

/**
 * Finds a user by their email address in the /users collection.
 * @param {string} email - The email to search for.
 * @returns {Promise<import('../types/index').User|null>} The user data or null if not found.
 */
export async function getUserByEmail(email) {
  try {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { uid: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * Creates a user document in the /users collection.
 * @param {string} uid - The user's UID (used as document ID).
 * @param {string} email - The user's email.
 * @param {string} displayName - The user's display name.
 * @returns {Promise<void>}
 */
export async function createUserDocument(uid, email, displayName) {
  try {
    await setDoc(doc(db, 'users', uid), {
      email,
      displayName,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}
