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
import 'prismjs/themes/prism.css'; // Use Prism CSS for styling

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

  // Map language to Prism language for highlighting
  const getPrismLanguage = () => {
    switch (language) {
      case 'none':
        return null; // No highlighting for plain text
      case 'python':
        return languages.python;
      case 'cpp':
        return languages.cpp;
      case 'csharp':
        return languages.csharp;
      case 'java':
        return languages.java;
      case 'jsx':
        return languages.jsx;
      default:
        return null;
    }
  };

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const selectStyle = {
    padding: '5px',
    fontSize: '14px',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '5px 10px',
    cursor: 'pointer',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
  };

  const editorStyle = {
    flex: 1,
    background: '#f4f4f4',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    overflowY: 'auto',
    fontFamily: 'Consolas, monospace',
    fontSize: '14px',
    minHeight: '150px',
    maxHeight: 'calc(100% - 60px)', // Adjust for header and save button
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '18px', margin: '10px 0' }}>Notepad</h1>
        <div>
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
          <button style={buttonStyle} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <Editor
        value={content}
        onValueChange={(code) => setContent(code)}
        highlight={(code) => (getPrismLanguage() ? highlight(code, getPrismLanguage(), language) : code)}
        padding={10}
        style={editorStyle}
        placeholder="Type or paste your text here..."
      />
    </div>
  );
}

export default Notepad;