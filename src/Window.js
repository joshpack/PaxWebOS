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
    border: '2px solid #000',
    background: '#fff',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
    zIndex: window.active ? 100 : 10,
    top: '50px',
    left: '50px',
  };

  const titleBarStyle = {
    background: window.active ? 'linear-gradient(to right, #000080, #1084d0)' : '#808080',
    color: '#fff',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    cursor: 'move',
    userSelect: 'none',
  };

  const buttonStyle = {
    background: '#c0c0c0',
    border: '1px solid #000',
    padding: '2px 10px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '5px',
  };

  const contentStyle = {
    padding: '10px',
    overflow: 'auto',
    height: 'calc(100% - 30px)',
    boxSizing: 'border-box',
    width: '100%',
  };

  const outlineStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${outline.width}px`,
    height: `${outline.height}px`,
    border: '2px dashed #0000ff',
    background: 'rgba(0, 0, 255, 0.1)',
    zIndex: 999, // Below handle but above content
    pointerEvents: 'none',
    display: outline.visible ? 'block' : 'none',
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
              <div>
                <button style={buttonStyle} onClick={() => closeWindow(id)}>
                  X
                </button>
              </div>
            </div>
            <div style={contentStyle}>
              {children}
            </div>
          </div>
        </ResizableBox>
        <div style={outlineStyle} className="resize-outline" />
      </div>
    </Draggable>
  );
}

export default Window;