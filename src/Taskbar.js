import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Taskbar({ openWindows, setActiveWindow, openWindow }) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleStartMenu = () => setIsStartOpen(!isStartOpen);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'numeric', 
      day: 'numeric' 
    });
    return `${time}\n${dateStr}`;
  };

  const taskbarStyle = {
    background: '#c0c0c0',
    border: '1px solid #808080',
    borderTop: '1px solid #fff',
    padding: '2px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '28px',
    zIndex: 1000,
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px'
  };

  const startButtonStyle = {
    background: '#c0c0c0',
    border: '2px outset #c0c0c0',
    padding: '2px 8px',
    cursor: 'pointer',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    marginRight: '4px',
    flexShrink: 0,
    height: '22px'
  };

  const startMenuStyle = {
    position: 'absolute',
    bottom: '30px',
    left: '2px',
    background: '#c0c0c0',
    border: '2px outset #c0c0c0',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    padding: '2px',
    width: '180px',
    zIndex: 1001
  };

  const startMenuItemStyle = {
    padding: '4px 8px',
    color: '#000',
    textDecoration: 'none',
    display: 'block',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    cursor: 'pointer',
    background: '#c0c0c0'
  };

  const startMenuItemHoverStyle = {
    background: '#0000ff',
    color: '#fff'
  };

  const taskItemStyle = (active) => ({
    background: '#c0c0c0',
    border: active ? '2px inset #c0c0c0' : '2px outset #c0c0c0',
    padding: '2px 8px',
    margin: '0 2px',
    cursor: 'pointer',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    height: '20px'
  });

  const clockStyle = {
    background: '#c0c0c0',
    border: '1px inset #c0c0c0',
    padding: '2px 6px',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '10px',
    textAlign: 'center',
    whiteSpace: 'pre',
    minWidth: '80px',
    boxSizing: 'border-box',
    flexShrink: 0,
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div style={taskbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div 
          style={startButtonStyle} 
          onClick={toggleStartMenu}
          onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
          onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
          onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
        >
          <span>🪟 Start</span>
        </div>
        
        {isStartOpen && (
          <div style={startMenuStyle}>
            <div
              style={hoveredItem === 'home' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('home')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                openWindow('home', 'Home');
                setIsStartOpen(false);
              }}
            >
              🏠 Home
            </div>
            <div
              style={hoveredItem === 'sfc' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('sfc')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                openWindow('sfc', 'SFC Analyzer');
                setIsStartOpen(false);
              }}
            >
              📡 SFC Analyzer
            </div>
            <div
              style={hoveredItem === 'memory' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('memory')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                openWindow('memory-dump', 'Memory Dump Analyzer');
                setIsStartOpen(false);
              }}
            >
              🗄 Memory Dump.dmp
            </div>
            <div
              style={hoveredItem === 'notepad' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('notepad')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                openWindow('notepad', 'Notepad++ Plus');
                setIsStartOpen(false);
              }}
            >
              📝 Notepad++ Plus
            </div>
            <div
              style={hoveredItem === 'ping' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('ping')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                openWindow('pingpong', 'Ping Pong Diagnostics');
                setIsStartOpen(false);
              }}
            >
              🏓 Network Diagnostics
            </div>
            <hr style={{ border: 'none', height: '1px', background: '#808080', margin: '2px 0' }} />
            <div
              style={hoveredItem === 'shutdown' ? {...startMenuItemStyle, ...startMenuItemHoverStyle} : startMenuItemStyle}
              onMouseEnter={() => setHoveredItem('shutdown')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (confirm('Are you sure you want to shut down PaxWebOS?')) {
                  window.location.reload();
                }
              }}
            >
              ⚡ Shut Down...
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {openWindows.map((win) => (
            <div
              key={win.id}
              style={taskItemStyle(win.active)}
              onClick={() => setActiveWindow(win.id)}
              title={win.title}
            >
              {win.title}
            </div>
          ))}
        </div>
      </div>
      
      <div style={clockStyle}>
        {formatDateTime(currentTime)}
      </div>
    </div>
  );
}

export default Taskbar;