import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';

function Notepad() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('none');
  
  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notepad-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languageOptions = [
    { value: 'none', label: 'Plain Text' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C/C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'java', label: 'Java' },
    { value: 'jsx', label: 'React (JSX)' },
  ];

  const getPrismLanguage = () => {
    switch (language) {
      case 'none': return null;
      case 'python': return languages.python;
      case 'cpp': return languages.cpp;
      case 'csharp': return languages.csharp;
      case 'java': return languages.java;
      case 'jsx': return languages.jsx;
      default: return null;
    }
  };

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'MS Sans Serif, sans-serif',
    background: '#c0c0c0'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px',
    borderBottom: '1px solid #808080',
    background: '#c0c0c0'
  };

  const selectStyle = {
    padding: '2px',
    fontSize: '11px',
    fontFamily: 'MS Sans Serif, sans-serif',
    border: '2px inset #c0c0c0',
    background: '#fff',
    marginRight: '4px'
  };

  const buttonStyle = {
    padding: '4px 8px',
    cursor: 'pointer',
    background: '#c0c0c0',
    color: '#000',
    border: '2px outset #c0c0c0',
    fontSize: '11px',
    fontFamily: 'MS Sans Serif, sans-serif'
  };

  const editorStyle = {
    flex: 1,
    background: '#fff',
    margin: '4px',
    border: '2px inset #c0c0c0',
    fontFamily: 'Courier New, monospace',
    fontSize: '12px',
    minHeight: '200px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '12px', margin: '0', color: '#000080', fontWeight: 'bold' }}>
          Notepad++ Plus v2.0 (Not affiliated with Notepad++)
        </h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            style={selectStyle}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button 
            style={buttonStyle} 
            onClick={handleSave}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            💾 Save
          </button>
        </div>
      </div>
      
      <Editor
        value={content}
        onValueChange={(code) => setContent(code)}
        highlight={(code) => (getPrismLanguage() ? highlight(code, getPrismLanguage(), language) : code)}
        padding={8}
        style={editorStyle}
        placeholder="Type or paste your text here..."
        textareaProps={{
          style: {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            outline: 'none'
          }
        }}
      />
    </div>
  );
}

export default Notepad;