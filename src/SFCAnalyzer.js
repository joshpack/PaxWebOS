import React, { useState } from 'react';

function SFCAnalyzer() {
  const [fullLog, setFullLog] = useState('');
  const [filteredLines, setFilteredLines] = useState({
    cannotRepair: [],
    repaired: [],
    repairingCorrupted: [],
  });
  const [activeTab, setActiveTab] = useState('full');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setFullLog(text);
        const lines = text.split('\n').map((line, index) => ({ line, lineNumber: index + 1 }));
        setFilteredLines({
          cannotRepair: lines.filter(item => item.line.toLowerCase().includes('cannot repair')),
          repaired: lines.filter(item => item.line.toLowerCase().includes('repaired')),
          repairingCorrupted: lines.filter(item => item.line.toLowerCase().includes('repairing corrupted')),
        });
      };
      reader.readAsText(file);
    }
  };

  const renderTabContent = () => {
    const renderWithLineNumbers = (items, isFullLog = false) => {
      const containerStyle = isFullLog
        ? { ...logContainerStyle, height: '250px', overflowY: 'scroll' } // Fixed height for Full Log
        : logContainerStyle;

      return (
        <div style={containerStyle}>
          <div style={lineNumberStyle}>
            {items.map((item, index) => (
              <div key={index} style={lineNumberCellStyle}>
                {item.lineNumber}
              </div>
            ))}
          </div>
          <pre style={logContentStyle}>
            {items.map((item, index) => (
              <div key={index} style={logLineStyle}>
                {activeTab === 'full' ? item.line : `${item.lineNumber}: ${item.line}`}
              </div>
            ))}
          </pre>
        </div>
      );
    };

    switch (activeTab) {
      case 'full':
        return fullLog ? (
          renderWithLineNumbers(fullLog.split('\n').map((line, index) => ({ line, lineNumber: index + 1 })), true)
        ) : (
          <p style={{ padding: '10px', fontFamily: 'MS Sans Serif, sans-serif', fontSize: '11px' }}>
            No file uploaded.
          </p>
        );
      case 'cannotRepair':
        return filteredLines.cannotRepair.length > 0 ? (
          renderWithLineNumbers(filteredLines.cannotRepair)
        ) : (
          <p style={{ padding: '10px', fontFamily: 'MS Sans Serif, sans-serif', fontSize: '11px' }}>
            No lines containing "cannot repair" found.
          </p>
        );
      case 'repaired':
        return filteredLines.repaired.length > 0 ? (
          renderWithLineNumbers(filteredLines.repaired)
        ) : (
          <p style={{ padding: '10px', fontFamily: 'MS Sans Serif, sans-serif', fontSize: '11px' }}>
            No lines containing "repaired" found.
          </p>
        );
      case 'repairingCorrupted':
        return filteredLines.repairingCorrupted.length > 0 ? (
          renderWithLineNumbers(filteredLines.repairingCorrupted)
        ) : (
          <p style={{ padding: '10px', fontFamily: 'MS Sans Serif, sans-serif', fontSize: '11px' }}>
            No lines containing "repairing corrupted" found.
          </p>
        );
      default:
        return null;
    }
  };

  const logContainerStyle = {
    display: 'flex',
    maxHeight: 'calc(100% - 100px)', // Adjusted for smaller window and UI elements
    overflowY: 'auto',
    width: '100%',
    border: '2px inset #c0c0c0',
    background: '#fff',
  };

  const lineNumberStyle = {
    width: '60px',
    background: '#e0e0e0',
    borderRight: '1px solid #808080',
    textAlign: 'right',
    padding: '4px',
    userSelect: 'none',
    flexShrink: 0,
  };

  const lineNumberCellStyle = {
    padding: '1px 0',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '10px',
    color: '#000',
  };

  const logContentStyle = {
    flex: 1,
    background: '#fff',
    padding: '4px',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '10px',
  };

  const logLineStyle = {
    padding: '1px 0',
  };

  const tabStyle = {
    display: 'flex',
    gap: '2px',
    marginBottom: '8px',
    padding: '4px',
  };

  const buttonStyle = (isActive) => ({
    padding: '4px 8px',
    cursor: 'pointer',
    border: isActive ? '2px inset #c0c0c0' : '2px outset #c0c0c0',
    background: '#c0c0c0',
    color: '#000',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
  });

  const fileInputStyle = {
    margin: '4px',
    padding: '2px',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'MS Sans Serif, sans-serif',
        background: '#c0c0c0',
      }}
    >
      <div style={{ padding: '4px', borderBottom: '1px solid #808080' }}>
        <h1 style={{ fontSize: '12px', margin: '4px 0', color: '#000080', fontWeight: 'bold' }}>
          System File Checker Analyzer v1.0
        </h1>
        <input
          type="file"
          accept=".txt,.log"
          onChange={handleFileUpload}
          style={fileInputStyle}
        />
      </div>

      <div style={tabStyle}>
        <button
          style={buttonStyle(activeTab === 'full')}
          onClick={() => setActiveTab('full')}
          onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
          onMouseUp={(e) => (e.target.style.border = activeTab === 'full' ? '2px inset #c0c0c0' : '2px outset #c0c0c0')}
        >
          Full Log
        </button>
        <button
          style={buttonStyle(activeTab === 'cannotRepair')}
          onClick={() => setActiveTab('cannotRepair')}
          onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
          onMouseUp={(e) => (e.target.style.border = activeTab === 'cannotRepair' ? '2px inset #c0c0c0' : '2px outset #c0c0c0')}
        >
          Cannot Repair
        </button>
        <button
          style={buttonStyle(activeTab === 'repaired')}
          onClick={() => setActiveTab('repaired')}
          onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
          onMouseUp={(e) => (e.target.style.border = activeTab === 'repaired' ? '2px inset #c0c0c0' : '2px outset #c0c0c0')}
        >
          Repaired
        </button>
        <button
          style={buttonStyle(activeTab === 'repairingCorrupted')}
          onClick={() => setActiveTab('repairingCorrupted')}
          onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
          onMouseUp={(e) => (e.target.style.border = activeTab === 'repairingCorrupted' ? '2px inset #c0c0c0' : '2px outset #c0c0c0')}
        >
          Repairing Corrupted
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '4px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default SFCAnalyzer;