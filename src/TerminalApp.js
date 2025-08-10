import React, { useState, useEffect, useRef } from 'react';

const initialFileSystem = {
  name: '/',
  type: 'dir',
  children: {
    'home': {
      type: 'dir',
      children: {
        'readme.txt': {
          type: 'file',
          content:
            "Welcome to the PaxWebOS fake terminal!\nTry commands like ls, cd, cat, nano, rm, mv.\nType 'help' for commands.",
        },
        'jokes.txt': {
          type: 'file',
          content:
            `Q: Why do programmers prefer dark mode?\nA: Because light attracts bugs!\n\n` +
            `Q: How many programmers does it take to change a light bulb?\n` +
            `A: None, that's a hardware problem!\n\n` +
            `Q: What's a programmer's favorite hangout place?\n` +
            `A: Foo Bar.`,
        },
        'todo.txt': {
          type: 'file',
          content:
            "- Implement fake filesystem\n- Add nano editor\n- Add funny jokes\n- ???\n- Profit!",
        },
        'notes': {
          type: 'dir',
          children: {
            'tech.txt': {
              type: 'file',
              content:
                "Remember to drink coffee ☕ and push to GitHub often.",
            },
          },
        },
      },
    },
    'bin': {
      type: 'dir',
      children: {
        'nano': {
          type: 'file',
          content: 'This is the nano editor app (use: nano filename)',
        },
      },
    },
    'etc': {
      type: 'dir',
      children: {
        'config.sys': {
          type: 'file',
          content:
            "system_mode=legacy\nmax_connections=42\nwelcome_message=Welcome to PaxWebOS!",
        },
      },
    },
    'var': {
      type: 'dir',
      children: {
        'log.txt': {
          type: 'file',
          content:
            "System started at 10:00AM\nNo errors reported.\nJust some friendly pings.",
        },
      },
    },
    'secret': {
      type: 'dir',
      children: {
        'easter_egg.txt': {
          type: 'file',
          content:
            "🎉 You found the secret easter egg! 🎉\nKeep hacking, cowboy.",
        },
      },
    },
  },
};

function TerminalApp() {
  const [cwd, setCwd] = useState(['/']); // current working directory as array
  const [fs, setFs] = useState(initialFileSystem);
  const [log, setLog] = useState([
    "Welcome to the PaxWebOS Fake Terminal.",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState('');
  const [nanoFile, setNanoFile] = useState(null); // { pathArray, content, isEditing }
  const inputRef = useRef(null);
  const logEndRef = useRef(null);

  // Scroll terminal to bottom on new log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [log]);

  // Utility: resolve path string (absolute or relative) to array
  function resolvePath(pathStr) {
    if (!pathStr) return cwd;
    let parts = pathStr.split('/').filter(Boolean);
    let newPath = [...cwd];
    if (pathStr.startsWith('/')) {
      newPath = ['/'];
    }
    for (let part of parts) {
      if (part === '.') continue;
      else if (part === '..') {
        if (newPath.length > 1) newPath.pop();
      } else {
        newPath.push(part);
      }
    }
    return newPath;
  }

  // Utility: get FS node by path array, returns node or null
  function getNodeByPath(pathArr, root = fs) {
    if (pathArr.length === 1 && pathArr[0] === '/') return root;
    let node = root;
    for (let i = 1; i < pathArr.length; i++) {
      if (!node.children) return null;
      node = node.children[pathArr[i]];
      if (!node) return null;
    }
    return node;
  }

  // Utility: update FS node at path with new node (immutably)
  function updateNodeAtPath(pathArr, newNode, root = fs) {
    if (pathArr.length === 1 && pathArr[0] === '/') {
      return newNode; // replacing root
    }
    const clone = { ...root, children: { ...root.children } };
    let node = clone;
    for (let i = 1; i < pathArr.length - 1; i++) {
      node.children[pathArr[i]] = { ...node.children[pathArr[i]], children: { ...node.children[pathArr[i]].children } };
      node = node.children[pathArr[i]];
    }
    node.children[pathArr[pathArr.length - 1]] = newNode;
    return clone;
  }

  // Command implementations

  function cmdHelp() {
    appendLog(`Available commands:
ls [dir]          - list directory contents
cd [dir]          - change directory
pwd               - print current directory
cat <file>        - show file contents
nano <file>       - open file in nano editor
rm <file/dir>     - remove file or empty directory
mv <src> <dest>   - move or rename files/directories
clear             - clear the screen
help              - show this help message
exit              - clear the terminal (does not close window)
`);
  }

  function cmdPwd() {
    appendLog(cwd.length === 1 ? '/' : cwd.join('/').replace('//', '/'));
  }

  function cmdLs(args) {
    let targetPath = args[0] ? resolvePath(args[0]) : cwd;
    const node = getNodeByPath(targetPath);
    if (!node) {
      appendLog(`ls: cannot access '${args[0]}': No such file or directory`);
      return;
    }
    if (node.type === 'file') {
      appendLog(args[0]);
      return;
    }
    const entries = Object.entries(node.children || {}).map(([name, child]) => {
      return child.type === 'dir' ? `${name}/` : name;
    });
    appendLog(entries.join('  '));
  }

  function cmdCd(args) {
    if (!args[0]) {
      setCwd(['/']);
      return;
    }
    const newPath = resolvePath(args[0]);
    const node = getNodeByPath(newPath);
    if (!node) {
      appendLog(`cd: no such file or directory: ${args[0]}`);
      return;
    }
    if (node.type !== 'dir') {
      appendLog(`cd: not a directory: ${args[0]}`);
      return;
    }
    setCwd(newPath);
  }

  function cmdCat(args) {
    if (!args[0]) {
      appendLog('cat: missing file operand');
      return;
    }
    const path = resolvePath(args[0]);
    const node = getNodeByPath(path);
    if (!node) {
      appendLog(`cat: ${args[0]}: No such file or directory`);
      return;
    }
    if (node.type === 'dir') {
      appendLog(`cat: ${args[0]}: Is a directory`);
      return;
    }
    appendLog(node.content);
  }

  function cmdRm(args) {
    if (!args[0]) {
      appendLog('rm: missing operand');
      return;
    }
    const path = resolvePath(args[0]);
    if (path.length === 1) {
      appendLog('rm: refusing to remove root directory');
      return;
    }
    const parentPath = path.slice(0, -1);
    const nodeName = path[path.length - 1];
    const parentNode = getNodeByPath(parentPath);
    if (!parentNode || !parentNode.children[nodeName]) {
      appendLog(`rm: cannot remove '${args[0]}': No such file or directory`);
      return;
    }
    const targetNode = parentNode.children[nodeName];
    if (targetNode.type === 'dir' && Object.keys(targetNode.children).length > 0) {
      appendLog(`rm: cannot remove '${args[0]}': Directory not empty`);
      return;
    }
    // Remove the node immutably
    const newChildren = { ...parentNode.children };
    delete newChildren[nodeName];
    const newParent = { ...parentNode, children: newChildren };
    const newFs = updateNodeAtPath(parentPath, newParent);
    setFs(newFs);
    appendLog(`Removed '${args[0]}'`);
  }

  function cmdMv(args) {
    if (args.length < 2) {
      appendLog('mv: missing file operand');
      return;
    }
    const srcPath = resolvePath(args[0]);
    const destPath = resolvePath(args[1]);

    const srcParentPath = srcPath.slice(0, -1);
    const srcName = srcPath[srcPath.length - 1];
    const srcParentNode = getNodeByPath(srcParentPath);
    if (!srcParentNode || !srcParentNode.children[srcName]) {
      appendLog(`mv: cannot stat '${args[0]}': No such file or directory`);
      return;
    }
    const nodeToMove = srcParentNode.children[srcName];

    const destParentPath = destPath.slice(0, -1);
    const destName = destPath[destPath.length - 1];
    const destParentNode = getNodeByPath(destParentPath);
    if (!destParentNode) {
      appendLog(`mv: cannot move to '${args[1]}': No such directory`);
      return;
    }
    if (destParentNode.children[destName]) {
      appendLog(`mv: cannot move to '${args[1]}': Destination already exists`);
      return;
    }

    // Remove from src parent
    const newSrcChildren = { ...srcParentNode.children };
    delete newSrcChildren[srcName];
    const newSrcParent = { ...srcParentNode, children: newSrcChildren };

    // Add to dest parent
    const newDestChildren = { ...destParentNode.children, [destName]: nodeToMove };
    const newDestParent = { ...destParentNode, children: newDestChildren };

    // Update fs immutably
    let newFs = updateNodeAtPath(srcParentPath, newSrcParent);
    newFs = updateNodeAtPath(destParentPath, newDestParent, newFs);
    setFs(newFs);
    appendLog(`Moved '${args[0]}' to '${args[1]}'`);
  }

  // nano editor open
  function cmdNano(args) {
    if (!args[0]) {
      appendLog('nano: missing file operand');
      return;
    }
    const path = resolvePath(args[0]);
    const node = getNodeByPath(path);
    if (!node) {
      appendLog(`nano: ${args[0]}: No such file or directory`);
      return;
    }
    if (node.type === 'dir') {
      appendLog(`nano: ${args[0]}: Is a directory`);
      return;
    }
    setNanoFile({ path, content: node.content });
  }

  // nano editor save
  function nanoSave(content) {
    if (!nanoFile) return;
    const { path } = nanoFile;
    const node = getNodeByPath(path);
    if (!node) return;
    const updatedNode = { ...node, content };
    const newFs = updateNodeAtPath(path, updatedNode);
    setFs(newFs);
    appendLog(`Saved file '${path.join('/')}'`);
    setNanoFile(null);
  }

  // nano editor cancel
  function nanoCancel() {
    setNanoFile(null);
    appendLog('Cancelled nano editor');
  }

  function clearScreen() {
    setLog([]);
  }

  // Append a new line to terminal output
  function appendLog(message) {
    setLog((prev) => [...prev, message]);
  }

  // Parse and execute commands
  function executeCommand(commandLine) {
    if (!commandLine.trim()) return;

    appendLog(`> ${commandLine}`);

    const parts = commandLine.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        cmdHelp();
        break;
      case 'ls':
        cmdLs(args);
        break;
      case 'cd':
        cmdCd(args);
        break;
      case 'pwd':
        cmdPwd();
        break;
      case 'cat':
        cmdCat(args);
        break;
      case 'rm':
        cmdRm(args);
        break;
      case 'mv':
        cmdMv(args);
        break;
      case 'nano':
        cmdNano(args);
        break;
      case 'clear':
        clearScreen();
        break;
      case 'exit':
        clearScreen();
        appendLog('Type "help" for commands.');
        break;
      default:
        appendLog(`${cmd}: command not found`);
    }
  }

  // Handle user input enter press
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    }
  }

  // Nano editor UI
  function NanoEditor({ content, onSave, onCancel }) {
    const [text, setText] = useState(content);
    const textareaRef = useRef(null);

    useEffect(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, []);

    return (
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '70%',
          backgroundColor: '#222',
          color: 'lime',
          fontFamily: 'monospace',
          fontSize: '14px',
          border: '2px solid lime',
          boxShadow: '0 0 10px lime',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          zIndex: 9999,
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <b>nano - simple editor (Ctrl+S to save, Ctrl+Q to cancel)</b>
        </div>
        <textarea
          ref={textareaRef}
          style={{
            flex: 1,
            backgroundColor: 'black',
            color: 'lime',
            fontFamily: 'monospace',
            fontSize: '14px',
            border: '1px solid lime',
            resize: 'none',
            padding: '4px',
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 's') {
              e.preventDefault();
              onSave(text);
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'q') {
              e.preventDefault();
              onCancel();
            }
          }}
        />
        <div style={{ marginTop: 4 }}>
          <span style={{ color: 'gray' }}>
            Ctrl+S = Save, Ctrl+Q = Cancel
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'lime',
        fontFamily: 'monospace',
        fontSize: '14px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={logEndRef} />
      </div>
      <div>
        <span style={{ color: 'lime' }}>
          {cwd.length === 1
            ? '/'
            : cwd.join('/').replace('//', '/')}
          {' $ '}
        </span>
        <input
          ref={inputRef}
          type="text"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: 'black',
            color: 'lime',
            fontFamily: 'monospace',
            fontSize: '14px',
            border: 'none',
            outline: 'none',
            width: '80%',
          }}
          autoFocus
          autoComplete="off"
        />
      </div>

      {nanoFile && (
        <NanoEditor
          content={nanoFile.content}
          onSave={nanoSave}
          onCancel={nanoCancel}
        />
      )}
    </div>
  );
}

export default TerminalApp;
