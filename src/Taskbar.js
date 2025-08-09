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
      second: '2-digit',
      hour12: true,
    });
    const dateStr = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return `${time}\n${dateStr}`;
  };

  const taskbarStyle = {
    background: 'linear-gradient(to bottom, #c0c0c0, #808080)',
    padding: '5px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };

  const startButtonStyle = {
    background: '#c0c0c0',
    border: '1px solid #000',
    padding: '5px 10px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    flexShrink: 0,
  };

  const startMenuStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '5px',
    background: '#c0c0c0',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    padding: '10px',
    width: '200px',
  };

  const startMenuItemStyle = {
    padding: '5px 10px',
    color: '#000',
    textDecoration: 'none',
    display: 'block',
    fontFamily: 'Arial, sans-serif',
  };

  const taskItemStyle = (active) => ({
    background: active ? '#d0d0d0' : '#c0c0c0',
    border: active ? '1px inset #000' : '1px outset #000',
    padding: '5px 10px',
    margin: '0 5px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  });

  const clockStyle = {
    background: '#c0c0c0',
    border: '1px inset #000',
    padding: '5px 8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    textAlign: 'right',
    whiteSpace: 'pre',
    width: '110px',
    maxWidth: '120px',
    boxSizing: 'border-box',
    marginRight: '2px',
    flexShrink: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div style={taskbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
        <div style={startButtonStyle} onClick={toggleStartMenu}>
          <span style={{ fontWeight: 'bold' }}>Start</span>
        </div>
        {isStartOpen && (
          <div style={startMenuStyle}>
            <Link
              to="/"
              style={startMenuItemStyle}
              onClick={() => {
                openWindow('home', 'Home');
                setIsStartOpen(false);
              }}
            >
              Home
            </Link>
            <Link
              to="/sfc"
              style={startMenuItemStyle}
              onClick={() => {
                openWindow('sfc', 'SFC Analyzer');
                setIsStartOpen(false);
              }}
            >
              SFC Analyzer
            </Link>
            <Link
              to="/memory-dump"
              style={startMenuItemStyle}
              onClick={() => {
                openWindow('memory-dump', 'Memory Dump Analyzer');
                setIsStartOpen(false);
              }}
            >
              Memory Dump.dmp
            </Link>
            <Link
              to="/notepad"
              style={startMenuItemStyle}
              onClick={() => {
                openWindow('notepad', 'Notepad');
                setIsStartOpen(false);
              }}
            >
              Notepad
            </Link>
          </div>
        )}
        {openWindows.map((win) => (
          <div
            key={win.id}
            style={taskItemStyle(win.active)}
            onClick={() => setActiveWindow(win.id)}
          >
            {win.title}
          </div>
        ))}
      </div>
      <div style={clockStyle}>
        {formatDateTime(currentTime)}
      </div>
    </div>
  );
}

export default Taskbar;