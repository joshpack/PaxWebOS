import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

function Window({ id, title, width, height, x, y, zIndex, active, openWindows, closeWindow, setActiveWindow, updateWindowSize, children }) {
  const nodeRef = useRef(null);

  const handleClick = () => {
    setActiveWindow(id);
  };

  const handleResize = (event, { size }) => {
    updateWindowSize(id, size.width, size.height);
  };

  return (
    <Draggable
      handle=".window-header"
      defaultPosition={{ x, y }}
      onStart={handleClick}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        style={{
          position: 'absolute',
          zIndex,
          width: `${width}px`,
          boxShadow: active ? '2px 2px 5px rgba(0,0,0,0.3)' : 'none',
          border: '2px outset #c0c0c0',
          background: '#c0c0c0',
          fontFamily: 'MS Sans Serif, sans-serif',
        }}
      >
        <div
          className="window-header"
          style={{
            background: active ? 'linear-gradient(to right, #000080, #1084d0)' : '#808080',
            color: 'white',
            padding: '2px 4px',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
          }}
        >
          <span>{title}</span>
          <button
            style={{
              padding: '0 8px',
              fontSize: '12px',
              border: '2px outset #c0c0c0',
              background: '#c0c0c0',
              color: '#000',
            }}
            onClick={() => closeWindow(id)}
            onMouseDown={(e) => (e.target.style.border = '2px inset #c0c0c0')}
            onMouseUp={(e) => (e.target.style.border = '2px outset #c0c0c0')}
            onMouseLeave={(e) => (e.target.style.border = '2px outset #c0c0c0')}
          >
            X
          </button>
        </div>
        <ResizableBox
          width={width}
          height={height}
          minConstraints={[250, 300]}
          maxConstraints={[window.innerWidth - 20, window.innerHeight - 50]}
          onResizeStop={handleResize}
          style={{
            border: '2px inset #c0c0c0',
            background: '#c0c0c0',
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            {children}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}

export default Window;