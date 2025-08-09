import React, { useState, useEffect, useRef, useCallback } from 'react';

function PingPong() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    playerScore: 0,
    cpuScore: 0,
    networkStats: {
      ping: 12,
      packetsLost: 0,
      jitter: 0.3
    }
  });

  // Game objects
  const gameObjects = useRef({
    paddle: { x: 30, y: 200, width: 10, height: 80, speed: 6 },
    cpuPaddle: { x: 560, y: 200, width: 10, height: 80, speed: 4 },
    ball: { x: 300, y: 250, dx: 4, dy: 3, radius: 6, trail: [] }
  });

  const keys = useRef({});

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
    };
    
    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateNetworkStats = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      networkStats: {
        ping: Math.floor(Math.random() * 20) + 8,
        packetsLost: prev.networkStats.packetsLost,
        jitter: (Math.random() * 2).toFixed(1)
      }
    }));
  }, []);

  const resetBall = useCallback(() => {
    const { ball } = gameObjects.current;
    ball.x = 300;
    ball.y = 250;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.dy = (Math.random() - 0.5) * 6;
    ball.trail = [];
  }, []);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const { paddle, cpuPaddle, ball } = gameObjects.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update paddle position
    if (keys.current['ArrowUp'] && paddle.y > 0) {
      paddle.y -= paddle.speed;
    }
    if (keys.current['ArrowDown'] && paddle.y < canvas.height - paddle.height) {
      paddle.y += paddle.speed;
    }

    // CPU AI
    const cpuCenter = cpuPaddle.y + cpuPaddle.height / 2;
    if (cpuCenter < ball.y - 10) {
      cpuPaddle.y += cpuPaddle.speed;
    } else if (cpuCenter > ball.y + 10) {
      cpuPaddle.y -= cpuPaddle.speed;
    }
    cpuPaddle.y = Math.max(0, Math.min(canvas.height - cpuPaddle.height, cpuPaddle.y));

    // Update ball
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 8) {
      ball.trail.shift();
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
      ball.dy = -ball.dy;
    }

    // Paddle collisions
    if (ball.x <= paddle.x + paddle.width && 
        ball.y >= paddle.y && 
        ball.y <= paddle.y + paddle.height &&
        ball.dx < 0) {
      ball.dx = -ball.dx * 1.05;
      updateNetworkStats();
    }

    if (ball.x >= cpuPaddle.x - ball.radius && 
        ball.y >= cpuPaddle.y && 
        ball.y <= cpuPaddle.y + cpuPaddle.height &&
        ball.dx > 0) {
      ball.dx = -ball.dx * 1.05;
      updateNetworkStats();
    }

    // Scoring
    if (ball.x < 0) {
      setGameState(prev => ({
        ...prev,
        cpuScore: prev.cpuScore + 1,
        networkStats: { ...prev.networkStats, packetsLost: prev.networkStats.packetsLost + 1 }
      }));
      resetBall();
    }
    if (ball.x > canvas.width) {
      setGameState(prev => ({ ...prev, playerScore: prev.playerScore + 1 }));
      resetBall();
    }
  }, [gameState.isPlaying, gameState.isPaused, updateNetworkStats, resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { paddle, cpuPaddle, ball } = gameObjects.current;

    // Clear canvas with retro green background
    ctx.fillStyle = '#003300';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = '#004400';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw ball trail
    ball.trail.forEach((point, index) => {
      const alpha = (index + 1) / ball.trail.length * 0.5;
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
    });

    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillRect(cpuPaddle.x, cpuPaddle.y, cpuPaddle.width, cpuPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw scores
    ctx.font = '24px MS Sans Serif';
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.playerScore.toString(), canvas.width / 4, 40);
    ctx.fillText(gameState.cpuScore.toString(), (canvas.width * 3) / 4, 40);
  }, [gameState.playerScore, gameState.cpuScore]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      playerScore: 0,
      cpuScore: 0,
      networkStats: { ping: 12, packetsLost: 0, jitter: 0.3 }
    });
    resetBall();
  };

  const showNetworkDiagnostics = () => {
    const report = `Network Diagnostics Report

Connection Status: ${gameState.isPlaying ? 'ACTIVE' : 'IDLE'}
Ping: ${gameState.networkStats.ping}ms
Packet Loss: ${gameState.networkStats.packetsLost}
Jitter: ${gameState.networkStats.jitter}ms
Protocol: ICMP (Internet Control Meme Protocol)
Bandwidth: ${Math.floor(Math.random() * 40) + 60}% utilized

Note: All network statistics are completely legitimate and not at all related to gaming performance.`;
    
    alert(report);
  };

  // Start game loop when playing
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoop();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameLoop]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  const buttonStyle = (active = false) => ({
    padding: '4px 8px',
    cursor: 'pointer',
    border: '2px outset #c0c0c0',
    background: '#c0c0c0',
    color: '#000',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    marginRight: '4px'
  });

  const statusStyle = {
    background: '#c0c0c0',
    padding: '4px',
    border: '1px inset #c0c0c0',
    fontSize: '10px',
    fontFamily: 'MS Sans Serif, sans-serif',
    marginTop: '4px'
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: 'MS Sans Serif, sans-serif',
      background: '#c0c0c0'
    }}>
      <div style={{ padding: '4px', borderBottom: '1px solid #808080' }}>
        <h1 style={{ fontSize: '12px', margin: '4px 0', color: '#000080', fontWeight: 'bold' }}>
          🏓 Ping Pong Network Diagnostics Tool v1.337
        </h1>
        
        <div style={{ marginBottom: '4px' }}>
          <button 
            style={buttonStyle(!gameState.isPlaying)} 
            onClick={startGame}
            disabled={gameState.isPlaying}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            Start Network Test
          </button>
          <button 
            style={buttonStyle(gameState.isPaused)} 
            onClick={pauseGame}
            disabled={!gameState.isPlaying}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            style={buttonStyle()} 
            onClick={resetGame}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            Reset
          </button>
          <button 
            style={buttonStyle()} 
            onClick={showNetworkDiagnostics}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            View Diagnostics
          </button>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        border: '2px inset #c0c0c0', 
        background: '#003300',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '4px'
      }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ 
            border: '1px solid #000',
            background: '#003300'
          }}
        />
      </div>

      <div style={statusStyle}>
        <div>Network Status: PING {gameState.networkStats.ping}ms | Jitter {gameState.networkStats.jitter}ms | Packet Loss: {gameState.networkStats.packetsLost}</div>
        <div>Score - Local: {gameState.playerScore} | Remote: {gameState.cpuScore} | Use ↑↓ arrows to adjust connection quality</div>
      </div>
    </div>
  );
}

export default PingPong;