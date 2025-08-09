import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SFCAnalyzer from './SFCAnalyzer';
import MemoryDumpAnalyzer from './MemoryDumpAnalyzer';
import Notepad from './Notepad';
import PingPong from './PingPong';
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
          <div style={{ 
            padding: '20px', 
            fontFamily: 'MS Sans Serif, sans-serif', 
            fontSize: '11px',
            textAlign: 'center',
            background: '#c0c0c0',
            height: '100%'
          }}>
            <h1 style={{ 
              fontSize: '16px', 
              margin: '20px 0', 
              color: '#000080',
              fontWeight: 'bold'
            }}>
              Welcome to PaxWebOS v98.1
            </h1>
            <p style={{ margin: '20px 0', color: '#000' }}>
              Select an application from the buttons below:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '200px'
                }}
                onClick={() => openWindow('sfc', 'SFC Analyzer')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                📡 SFC Analyzer
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '200px'
                }}
                onClick={() => openWindow('memory-dump', 'Memory Dump Analyzer')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🗄 Memory Dump Analyzer
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '200px'
                }}
                onClick={() => openWindow('notepad', 'Notepad++ Plus')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                📝 Notepad++ Plus
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '200px'
                }}
                onClick={() => openWindow('pingpong', 'Ping Pong Diagnostics')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🏓 Network Ping Diagnostics
              </button>
            </div>
          </div>
        );
      case 'sfc':
        return <SFCAnalyzer />;
      case 'memory-dump':
        return <MemoryDumpAnalyzer />;
      case 'notepad':
        return <Notepad />;
      case 'pingpong':
        return <PingPong />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 1,
            background: '#008080', // Classic teal desktop
            overflow: 'hidden',
            paddingBottom: '40px',
            position: 'relative'
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
            <Route path="/pingpong" element={null} />
          </Routes>
        </div>
        <Taskbar openWindows={openWindows} setActiveWindow={setActiveWindow} openWindow={openWindow} />
      </div>
    </Router>
  );
}

export default App;