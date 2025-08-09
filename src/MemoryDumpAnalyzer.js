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

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'MS Sans Serif, sans-serif',
    background: '#c0c0c0'
  };

  const headerStyle = {
    padding: '4px',
    borderBottom: '1px solid #808080',
    background: '#c0c0c0'
  };

  const fileInputStyle = {
    margin: '4px 0',
    padding: '2px',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px'
  };

  const contentAreaStyle = {
    flex: 1,
    overflow: 'hidden',
    padding: '4px'
  };

  const resultsContainerStyle = {
    maxHeight: 'calc(100% - 40px)',
    overflowY: 'auto',
    border: '2px inset #c0c0c0',
    background: '#fff',
    padding: '4px'
  };

  const preStyle = {
    background: '#fff',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    fontSize: '10px',
    fontFamily: 'Courier New, monospace',
    padding: '4px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '12px', margin: '4px 0', color: '#000080', fontWeight: 'bold' }}>
          Memory Dump Analyzer v1.0 - String Extractor
        </h1>
        <input
          type="file"
          accept=".dmp"
          onChange={handleFileUpload}
          style={fileInputStyle}
        />
      </div>
      
      <div style={contentAreaStyle}>
        {extractedStrings.length > 0 ? (
          <div>
            <h2 style={{ fontSize: '11px', margin: '4px 0', color: '#000080' }}>
              Extracted Strings ({extractedStrings.length} found)
            </h2>
            <div style={resultsContainerStyle}>
              <pre style={preStyle}>
                {extractedStrings.join('\n')}
              </pre>
            </div>
          </div>
        ) : (
          <p style={{ 
            padding: '10px', 
            fontFamily: 'MS Sans Serif, sans-serif', 
            fontSize: '11px',
            color: '#000'
          }}>
            No memory dump file uploaded. Select a .dmp file to extract readable strings.
          </p>
        )}
      </div>
    </div>
  );
}

export default MemoryDumpAnalyzer;