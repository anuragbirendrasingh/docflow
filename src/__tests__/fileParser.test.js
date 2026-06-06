import { parseFile, getFileExtension, textToTiptapJSON } from '../lib/fileParser';

// Mock mammoth since it's a dynamic import in the real file
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({ value: 'Parsed docx content' })
}));

describe('fileParser utility', () => {
  it('getFileExtension returns correct extension', () => {
    expect(getFileExtension('document.txt')).toBe('txt');
    expect(getFileExtension('report.FINAL.docx')).toBe('docx');
    expect(getFileExtension('noextension')).toBe('');
  });

  it('textToTiptapJSON converts plain text to correct JSON format', () => {
    const text = 'Line 1\n\nLine 2';
    const jsonStr = textToTiptapJSON(text);
    const jsonObj = JSON.parse(jsonStr);

    expect(jsonObj.type).toBe('doc');
    expect(jsonObj.content).toHaveLength(3);
    
    // First line
    expect(jsonObj.content[0].type).toBe('paragraph');
    expect(jsonObj.content[0].content[0].text).toBe('Line 1');
    
    // Empty line
    expect(jsonObj.content[1].type).toBe('paragraph');
    expect(jsonObj.content[1].content).toBeUndefined();
    
    // Second line
    expect(jsonObj.content[2].type).toBe('paragraph');
    expect(jsonObj.content[2].content[0].text).toBe('Line 2');
  });

  it('parseFile correctly parses a .txt file', async () => {
    const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
    const result = await parseFile(file);
    const jsonObj = JSON.parse(result);
    
    expect(jsonObj.type).toBe('doc');
    expect(jsonObj.content[0].content[0].text).toBe('Hello World');
  });

  it('parseFile throws error for unsupported file type', async () => {
    const file = new File(['Fake PDF'], 'test.pdf', { type: 'application/pdf' });
    
    await expect(parseFile(file)).rejects.toThrow('Unsupported file type');
  });
});
