import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SFCAnalyzer from './SFCAnalyzer';
import MemoryDumpAnalyzer from './MemoryDumpAnalyzer';
import Notepad from './Notepad';
import Window from './Window';
import Taskbar from './Taskbar';

function App() {
  const [openWindows, setOpenWindows] = useState([
    { id: `home-${Date.now()}`, title: 'Home', component: 'home', active: true },
  ]);

  const openWindow = (component, title) => {
    const id = `${component}-${Date.now()}`;
    setOpenWindows((prev) => [
      ...prev.map((win) => ({ ...win, active: false })),
      { id, title, component, active: true },
    ]);
  };

  const closeWindow = (id) => {
    setOpenWindows((prev) => {
      const newWindows = prev.filter((win) => win.id !== id);
      if (newWindows.length > 0) {
        newWindows[newWindows.length - 1].active = true;
      }
      return newWindows;
    });
  };

  const setActiveWindow = (id) => {
    setOpenWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, active: true } : { ...win, active: false }
      )
    );
  };

  const renderComponent = (component) => {
    switch (component) {
      case 'home':
        return (
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <h1>Welcome to JoshPack</h1>
            <button
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => openWindow('sfc', 'SFC Analyzer')}
            >
              Go to SFC Analyzer
            </button>
            <button
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                marginLeft: '10px',
              }}
              onClick={() => openWindow('notepad', 'Notepad')}
            >
              Go to Notepad
            </button>
          </div>
        );
      case 'sfc':
        return <SFCAnalyzer />;
      case 'memory-dump':
        return <MemoryDumpAnalyzer />;
      case 'notepad':
        return <Notepad />;
      default:
        return null;
    }
  };

  console.log('Attempting to load wallpaper from /img/98.jpg');

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 1,
            backgroundImage: 'url(/img/98.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#008080',
            overflow: 'hidden',
            paddingBottom: '40px',
          }}
        >
          {openWindows.map((window) => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              openWindows={openWindows}
              closeWindow={closeWindow}
              setActiveWindow={setActiveWindow}
            >
              {renderComponent(window.component)}
            </Window>
          ))}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/sfc" element={null} />
            <Route path="/memory-dump" element={null} />
            <Route path="/notepad" element={null} />
          </Routes>
        </div>
        <Taskbar openWindows={openWindows} setActiveWindow={setActiveWindow} openWindow={openWindow} />
      </div>
    </Router>
  );
}

export default App;