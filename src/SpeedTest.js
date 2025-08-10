import React, { useState } from 'react';

function SpeedTest() {
  const [testStatus, setTestStatus] = useState('idle'); // idle, running, complete
  const [results, setResults] = useState({
    downloadSpeed1MB: null,
    downloadSpeed10MB: null,
    uploadSpeed: null,
    ping: null,
    log: [],
  });

  const logMessage = (message) => {
    setResults((prev) => ({
      ...prev,
      log: [...prev.log, `${new Date().toLocaleTimeString([], { hour12: true })}: ${message}`],
    }));
  };

  const startSpeedTest = async () => {
    setTestStatus('running');
    setResults({ downloadSpeed1MB: null, downloadSpeed10MB: null, uploadSpeed: null, ping: null, log: [] });
    logMessage('Starting speed test...');

    // Ping Test
    try {
      const startTime = performance.now();
      await fetch('https://www.google.com', { mode: 'no-cors' });
      const ping = Math.round(performance.now() - startTime);
      setResults((prev) => ({ ...prev, ping }));
      logMessage(`Ping: ${ping} ms`);
    } catch (error) {
      logMessage(`Ping test failed: ${error.message}. Check your network connection.`);
    }

    // 1MB Download Test
    const imageAddr1MB = '/testfile-1mb.bin'; // Local file
    const downloadSize1MB = 1_000_000; // 1MB
    try {
      logMessage('Starting 1MB download test...');
      const startTime = performance.now();
      const response = await fetch(imageAddr1MB, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      await response.blob();
      const duration = (performance.now() - startTime) / 1000;
      const bitsLoaded = downloadSize1MB * 8;
      const speedBps = bitsLoaded / duration;
      const speedMbps = (speedBps / 1_000_000).toFixed(2); // Convert to Mbps
      setResults((prev) => ({ ...prev, downloadSpeed1MB: speedMbps }));
      logMessage(`1MB Download speed: ${speedMbps} Mbps`);
    } catch (error) {
      logMessage(`1MB Download test failed: ${error.message}. Ensure testfile-1mb.bin is in the public folder.`);
    }

    // 10MB Download Test
    const imageAddr10MB = '/testfile-10mb.bin'; // Local file
    const downloadSize10MB = 10_000_000; // 10MB
    try {
      logMessage('Starting 10MB download test...');
      const startTime = performance.now();
      const response = await fetch(imageAddr10MB, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      await response.blob();
      const duration = (performance.now() - startTime) / 1000;
      const bitsLoaded = downloadSize10MB * 8;
      const speedBps = bitsLoaded / duration;
      const speedMbps = (speedBps / 1_000_000).toFixed(2); // Convert to Mbps
      setResults((prev) => ({ ...prev, downloadSpeed10MB: speedMbps }));
      logMessage(`10MB Download speed: ${speedMbps} Mbps`);
    } catch (error) {
      logMessage(`10MB Download test failed: ${error.message}. Ensure testfile-10mb.bin is in the public folder.`);
    }

    // Upload Test
    try {
      logMessage('Starting upload test...');
      const uploadData = new Blob([new ArrayBuffer(1_000_000)]); // 1MB
      const startTime = performance.now();
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: uploadData,
      });
      const duration = (performance.now() - startTime) / 1000;
      const bitsUploaded = 1_000_000 * 8;
      const speedBps = bitsUploaded / duration;
      const speedMbps = (speedBps / 1_000_000).toFixed(2); // Convert to Mbps
      setResults((prev) => ({ ...prev, uploadSpeed: speedMbps }));
      logMessage(`Upload speed: ${speedMbps} Mbps`);
    } catch (error) {
      logMessage(`Upload test failed: ${error.message}. Check your network or try a different test server.`);
    }

    setTestStatus('complete');
    logMessage('Speed test complete.');
  };

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'MS Sans Serif, sans-serif',
    background: '#c0c0c0',
  };

  const headerStyle = {
    padding: '4px',
    borderBottom: '1px solid #808080',
  };

  const titleStyle = {
    fontSize: '12px',
    margin: '4px 0',
    color: '#000080',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: '4px 8px',
    cursor: testStatus === 'running' ? 'not-allowed' : 'pointer',
    border: '2px outset #c0c0c0',
    background: '#c0c0c0',
    color: '#000',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    margin: '4px',
  };

  const resultsStyle = {
    padding: '8px',
    fontSize: '11px',
    color: '#000',
  };

  const logContainerStyle = {
    height: '200px', // Scrollable log
    overflowY: 'scroll',
    width: '100%',
    border: '2px inset #c0c0c0',
    background: '#fff',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '10px',
    padding: '4px',
    marginTop: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Internet Speed Test v1.0</h1>
        <button
          style={buttonStyle}
          onClick={startSpeedTest}
          disabled={testStatus === 'running'}
          onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
          onMouseUp={(e) => (e.target.style.border = '2px outset #c0c0c0')}
          onMouseLeave={(e) => (e.target.style.border = '2px outset #c0c0c0')}
        >
          {testStatus === 'running' ? 'Testing...' : 'Start Speed Test'}
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px' }}>
        <div style={resultsStyle}>
          {results.downloadSpeed1MB && <p>1MB Download Speed: {results.downloadSpeed1MB} Mbps</p>}
          {results.downloadSpeed10MB && <p>10MB Download Speed: {results.downloadSpeed10MB} Mbps</p>}
          {results.uploadSpeed && <p>Upload Speed: {results.uploadSpeed} Mbps</p>}
          {results.ping && <p>Ping: {results.ping} ms</p>}
          {testStatus === 'idle' && <p>Click "Start Speed Test" to begin.</p>}
          {testStatus === 'complete' && !results.downloadSpeed1MB && !results.downloadSpeed10MB && (
            <p>Test completed. Check log for errors.</p>
          )}
        </div>
        <div style={logContainerStyle}>
          {results.log.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpeedTest;