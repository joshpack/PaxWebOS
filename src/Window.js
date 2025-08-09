import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import './Window.css';

function Window({ id, title, children, openWindows, closeWindow, setActiveWindow }) {
  const windowRef = useRef(null);
  const [outline, setOutline] = useState({ width: 600, height: 400, visible: false });
  const window = openWindows.find((win) => win.id === id);
  
  if (!window) return null;

  const windowStyle = {
    position: 'absolute',
    border: '2px outset #c0c0c0',
    background: '#c0c0c0',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    zIndex: window.active ? 100 : 10,
    top: '50px',
    left: '50px',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px'
  };

  const titleBarStyle = {
    background: window.active ? 
      'linear-gradient(90deg, #000080 0%, #1084d0 100%)' : 
      'linear-gradient(90deg, #808080 0%, #9090a0 100%)',
    color: '#fff',
    padding: '2px 4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'move',
    userSelect: 'none',
    height: '18px'
  };

  const buttonStyle = {
    background: '#c0c0c0',
    border: '1px outset #c0c0c0',
    width: '16px',
    height: '14px',
    cursor: 'pointer',
    fontSize: '8px',
    fontFamily: 'MS Sans Serif, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2px'
  };

  const contentStyle = {
    background: '#c0c0c0',
    overflow: 'auto',
    height: 'calc(100% - 22px)',
    boxSizing: 'border-box',
    width: '100%'
  };

  return (
    <Draggable
      nodeRef={windowRef}
      handle=".title-bar"
      bounds="parent"
      cancel=".react-resizable-handle"
    >
      <div
        ref={windowRef}
        style={windowStyle}
        onClick={() => setActiveWindow(id)}
        className="window-container"
      >
        <ResizableBox
          width={600}
          height={400}
          minConstraints={[300, 200]}
          maxConstraints={[800, 600]}
          resizeHandles={['se']}
          className="resizable-window"
          handle={<span className="react-resizable-handle custom-handle" />}
          onResizeStart={() => setOutline({ width: 600, height: 400, visible: true })}
          onResize={(e, { size }) => {
            setOutline({ width: Math.round(size.width), height: Math.round(size.height), visible: true });
          }}
          onResizeStop={(e, { size }) => {
            setOutline({ width: Math.round(size.width), height: Math.round(size.height), visible: false });
            windowRef.current.style.width = `${Math.round(size.width)}px`;
            windowRef.current.style.height = `${Math.round(size.height)}px`;
          }}
        >
          <div className="window-content" style={{ width: '100%', height: '100%' }}>
            <div className="title-bar" style={titleBarStyle}>
              <span>{title}</span>
              <div style={{ display: 'flex' }}>
                <button 
                  style={buttonStyle} 
                  onMouseDown={(e) => e.target.style.border = '1px inset #c0c0c0'}
                  onMouseUp={(e) => e.target.style.border = '1px outset #c0c0c0'}
                  onMouseLeave={(e) => e.target.style.border = '1px outset #c0c0c0'}
                >
                  _
                </button>
                <button 
                  style={buttonStyle}
                  onMouseDown={(e) => e.target.style.border = '1px inset #c0c0c0'}
                  onMouseUp={(e) => e.target.style.border = '1px outset #c0c0c0'}
                  onMouseLeave={(e) => e.target.style.border = '1px outset #c0c0c0'}
                >
                  □
                </button>
                <button 
                  style={buttonStyle} 
                  onClick={() => closeWindow(id)}
                  onMouseDown={(e) => e.target.style.border = '1px inset #c0c0c0'}
                  onMouseUp={(e) => e.target.style.border = '1px outset #c0c0c0'}
                  onMouseLeave={(e) => e.target.style.border = '1px outset #c0c0c0'}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={contentStyle}>
              {children}
            </div>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}

export default Window;