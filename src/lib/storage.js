import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path to upload the file to (e.g. 'documents/abc123/file.pdf').
 * @returns {Promise<string>} The download URL of the uploaded file.
 */
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
