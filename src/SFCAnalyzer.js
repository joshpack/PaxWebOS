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
    const renderWithLineNumbers = (items) => {
      return (
        <div style={logContainerStyle}>
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
          renderWithLineNumbers(fullLog.split('\n').map((line, index) => ({ line, lineNumber: index + 1 })))
        ) : (
          <p>No file uploaded.</p>
        );
      case 'cannotRepair':
        return filteredLines.cannotRepair.length > 0 ? (
          renderWithLineNumbers(filteredLines.cannotRepair)
        ) : (
          <p>No lines containing "cannot repair" found.</p>
        );
      case 'repaired':
        return filteredLines.repaired.length > 0 ? (
          renderWithLineNumbers(filteredLines.repaired)
        ) : (
          <p>No lines containing "repaired" found.</p>
        );
      case 'repairingCorrupted':
        return filteredLines.repairingCorrupted.length > 0 ? (
          renderWithLineNumbers(filteredLines.repairingCorrupted)
        ) : (
          <p>No lines containing "repairing corrupted" found.</p>
        );
      default:
        return null;
    }
  };

  const logContainerStyle = {
    display: 'flex',
    maxHeight: 'calc(100% - 100px)',
    overflowY: 'auto',
    width: '100%',
  };

  const lineNumberStyle = {
    width: '60px',
    background: '#f0f0f0',
    borderRight: '1px solid #ccc',
    textAlign: 'right',
    padding: '10px 5px',
    userSelect: 'none',
    flexShrink: 0,
  };

  const lineNumberCellStyle = {
    padding: '2px 0',
    fontFamily: 'Consolas, monospace',
    fontSize: '12px',
    color: '#555',
  };

  const logContentStyle = {
    flex: 1,
    background: '#f4f4f4',
    padding: '10px',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    fontFamily: 'Consolas, monospace',
    fontSize: '12px',
  };

  const logLineStyle = {
    padding: '2px 0',
  };

  const tabStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  };

  const buttonStyle = (isActive) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: isActive ? '#007bff' : '#fff',
    color: isActive ? '#fff' : '#000',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '18px', margin: '10px 0' }}>SFC Dump File Analyzer</h1>
      <input
        type="file"
        accept=".txt,.log"
        onChange={handleFileUpload}
        style={{ marginBottom: '10px' }}
      />
      <div style={tabStyle}>
        <button
          style={buttonStyle(activeTab === 'full')}
          onClick={() => setActiveTab('full')}
        >
          Full Log
        </button>
        <button
          style={buttonStyle(activeTab === 'cannotRepair')}
          onClick={() => setActiveTab('cannotRepair')}
        >
          Cannot Repair
        </button>
        <button
          style={buttonStyle(activeTab === 'repaired')}
          onClick={() => setActiveTab('repaired')}
        >
          Repaired
        </button>
        <button
          style={buttonStyle(activeTab === 'repairingCorrupted')}
          onClick={() => setActiveTab('repairingCorrupted')}
        >
          Repairing Corrupted
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default SFCAnalyzer;