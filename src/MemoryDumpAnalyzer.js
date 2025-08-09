import React, { useState } from 'react';

function MemoryDumpAnalyzer() {
  const [extractedStrings, setExtractedStrings] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const strings = extractStrings(buffer);
        setExtractedStrings(strings);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const extractStrings = (buffer) => {
    const strings = [];
    let current = '';
    const minLength = 4;
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      const char = view[i];
      if (char >= 32 && char <= 126) {
        current += String.fromCharCode(char);
      } else {
        if (current.length >= minLength) {
          strings.push(current);
        }
        current = '';
      }
    }
    if (current.length >= minLength) {
      strings.push(current);
    }
    return strings;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '18px', margin: '10px 0' }}>Memory Dump Analyzer</h1>
      <input
        type="file"
        accept=".dmp"
        onChange={handleFileUpload}
        style={{ marginBottom: '10px' }}
      />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {extractedStrings.length > 0 ? (
          <div style={{ maxHeight: 'calc(100% - 60px)', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '16px', margin: '10px 0' }}>Extracted Strings</h2>
            <pre
              style={{
                background: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                fontSize: '12px',
              }}
            >
              {extractedStrings.join('\n')}
            </pre>
          </div>
        ) : (
          <p>No relevant strings found or no file uploaded.</p>
        )}
      </div>
    </div>
  );
}

export default MemoryDumpAnalyzer;