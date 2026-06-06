/**
 * Extracts the file extension from a filename (lowercase, without the dot).
 * @param {string} filename - The filename to extract the extension from.
 * @returns {string} The lowercase file extension without the leading dot.
 */
export function getFileExtension(filename) {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts.pop().toLowerCase();
}

/**
 * Converts plain text into a Tiptap-compatible JSON document structure.
 * Each line becomes a paragraph node. Empty lines become paragraphs with no content array.
 * @param {string} text - The plain text to convert.
 * @returns {Object} A Tiptap JSON document object.
 */
export function textToTiptapJSON(text) {
  const lines = text.split('\n');
  const content = lines.map((line) => {
    if (line.trim() === '') {
      return { type: 'paragraph' };
    }
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    };
  });

  return {
    type: 'doc',
    content,
  };
}

/**
 * Reads a File object as text using FileReader.
 * @param {File} file - The file to read.
 * @returns {Promise<string>} The file contents as a string.
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Reads a File object as an ArrayBuffer.
 * @param {File} file - The file to read.
 * @returns {Promise<ArrayBuffer>} The file contents as an ArrayBuffer.
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses a file and returns its content as a stringified Tiptap JSON document.
 * Supports .txt, .md, and .docx files.
 * @param {File} file - The File object to parse.
 * @returns {Promise<string>} Stringified Tiptap JSON document.
 * @throws {Error} If the file type is not supported.
 */
export async function parseFile(file) {
  const extension = getFileExtension(file.name);

  switch (extension) {
    case 'txt': {
      const text = await readFileAsText(file);
      const tiptapDoc = textToTiptapJSON(text);
      return JSON.stringify(tiptapDoc);
    }

    case 'md': {
      const text = await readFileAsText(file);
      const tiptapDoc = textToTiptapJSON(text);
      return JSON.stringify(tiptapDoc);
    }

    case 'docx': {
      const mammoth = await import('mammoth');
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.extractRawText({ arrayBuffer });
      const tiptapDoc = textToTiptapJSON(result.value);
      return JSON.stringify(tiptapDoc);
    }

    default:
      throw new Error('Unsupported file type');
  }
}
