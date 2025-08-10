import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SFCAnalyzer from './SFCAnalyzer';
import MemoryDumpAnalyzer from './MemoryDumpAnalyzer';
import Notepad from './Notepad';
import PingPong from './PingPong';
import Astroidz from './Astroidz';
import SpeedTest from './SpeedTest';
import Window from './Window';
import Taskbar from './Taskbar';
import MapApp from './MapApp';

function App() {
  const [openWindows, setOpenWindows] = useState([
    { id: `home-${Date.now()}`, title: 'Home', component: 'home', active: true, width: 300, height: 400, x: 50, y: 50, zIndex: 1 },
  ]);

  const openWindow = (component, title) => {
    const windowSizes = {
      'sfc': { width: 500, height: 350 },
      'astroidz': { width: 650, height: 500 },
      'home': { width: 300, height: 400 }, // Reduced from 600x400
      'memory-dump': { width: 800, height: 600 },
      'notepad': { width: 600, height: 400 },
      'pingpong': { width: 650, height: 500 },
      'speedtest': { width: 500, height: 350 },
    };

    const { width, height } = windowSizes[component] || { width: 300, height: 400 };
    const id = `${component}-${Date.now()}`;
    const maxZIndex = Math.max(...openWindows.map(win => win.zIndex), 0) + 1;
    setOpenWindows((prev) => [
      ...prev.map((win) => ({ ...win, active: false })),
      { id, title, component, active: true, width, height, x: 50 + prev.length * 30, y: 50 + prev.length * 30, zIndex: maxZIndex },
    ]);
  };

  const closeWindow = (id) => {
    setOpenWindows((prev) => {
      const newWindows = prev.filter((win) => win.id !== id);
      if (newWindows.length > 0) {
        const maxZIndex = Math.max(...newWindows.map(win => win.zIndex));
        newWindows.find(win => win.zIndex === maxZIndex).active = true;
      }
      return newWindows;
    });
  };

  const setActiveWindow = (id) => {
    setOpenWindows((prev) => {
      const maxZIndex = Math.max(...prev.map(win => win.zIndex), 0) + 1;
      return prev.map((win) =>
        win.id === id ? { ...win, active: true, zIndex: maxZIndex } : { ...win, active: false }
      );
    });
  };

  const updateWindowSize = (id, width, height) => {
    setOpenWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, width, height } : win
      )
    );
  };

  const renderComponent = (component) => {
    switch (component) {
      case 'home':
        return (
          <div style={{ 
            padding: '10px', // Reduced padding for smaller window
            fontFamily: 'MS Sans Serif, sans-serif', 
            fontSize: '11px',
            textAlign: 'center',
            background: '#c0c0c0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h1 style={{ 
              fontSize: '14px', // Slightly smaller for compact window
              margin: '10px 0', 
              color: '#000080',
              fontWeight: 'bold'
            }}>
              Welcome to PaxWebOS v98.1
            </h1>
            <p style={{ margin: '10px 0', color: '#000' }}>
              Select an application:
            </p>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', // Reduced gap
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
              <button
                style={{
                  padding: '6px 12px', // Smaller buttons
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px', // Slightly smaller buttons
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
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
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
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
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
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
                }}
                onClick={() => openWindow('pingpong', 'Ping Pong Diagnostics')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🏓 Network Ping Diagnostics
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
                }}
                onClick={() => openWindow('astroidz', 'Astroidz Network Defense System v2.1')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🚀 Astroidz Network Defense System v2.1
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
                }}
                onClick={() => openWindow('speedtest', 'Internet Speed Test')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🌐 Internet Speed Test
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  background: '#c0c0c0',
                  color: '#000',
                  border: '2px outset #c0c0c0',
                  fontFamily: 'MS Sans Serif, sans-serif',
                  width: '180px',
                }}
                onClick={() => openWindow('map', 'Map')}
                onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
                onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
                onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
              >
                🌍 Map
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
      case 'astroidz':
        return <Astroidz />;
      case 'speedtest':
        return <SpeedTest />;
      case 'map':
        return <MapApp />;
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
            background: `url('/img/98-2.jpg') no-repeat center center fixed`,
            backgroundSize: 'cover',
            overflow: 'hidden',
            paddingBottom: '40px',
            position: 'relative',
          }}
        >
          {openWindows.map((window) => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              width={window.width}
              height={window.height}
              x={window.x}
              y={window.y}
              zIndex={window.zIndex}
              active={window.active}
              openWindows={openWindows}
              closeWindow={closeWindow}
              setActiveWindow={setActiveWindow}
              updateWindowSize={updateWindowSize}
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
            <Route path="/astroidz" element={null} />
            <Route path="/speedtest" element={null} />
            <Route path="/map" element={null} />
          </Routes>
        </div>
        <Taskbar openWindows={openWindows} setActiveWindow={setActiveWindow} openWindow={openWindow} />
      </div>
    </Router>
  );
}

export default App;