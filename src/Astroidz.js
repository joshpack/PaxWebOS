import React, { useState, useEffect, useRef, useCallback } from 'react';

function AsteroidsGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // High scores "database" - simulated server persistence
  const [highScores, setHighScores] = useState([
    { name: "ADMIN", score: 15420, timestamp: "2024-12-15 09:23:41" },
    { name: "SYS_USER", score: 12800, timestamp: "2024-12-14 16:45:22" },
    { name: "GUEST_007", score: 9650, timestamp: "2024-12-14 14:12:03" },
    { name: "NETWORK_OPS", score: 7330, timestamp: "2024-12-13 11:08:55" },
    { name: "VISITOR_42", score: 6120, timestamp: "2024-12-13 08:34:17" }
  ]);

  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    showHighScores: false,
    playerName: '',
    serverStatus: 'ONLINE'
  });

  const gameObjects = useRef({
    ship: { x: 300, y: 200, angle: 0, dx: 0, dy: 0, thrust: false, size: 8 },
    bullets: [],
    asteroids: [],
    particles: []
  });

  const keys = useRef({});

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === ' ') e.preventDefault();
    };
    
    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const createAsteroid = useCallback((x, y, size, dx, dy) => {
    return {
      x: x || Math.random() * 600,
      y: y || Math.random() * 400,
      size: size || 3,
      dx: dx || (Math.random() - 0.5) * 2,
      dy: dy || (Math.random() - 0.5) * 2,
      angle: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.1,
      vertices: Array.from({length: 8}, () => Math.random() * 0.4 + 0.8)
    };
  }, []);

  const createParticle = useCallback((x, y, color = '#00ff00') => {
    return {
      x, y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      life: 30,
      maxLife: 30,
      color
    };
  }, []);

  const initializeLevel = useCallback(() => {
    const { asteroids } = gameObjects.current;
    asteroids.length = 0;
    
    const asteroidCount = 4 + gameState.level;
    for (let i = 0; i < asteroidCount; i++) {
      let x, y;
      do {
        x = Math.random() * 600;
        y = Math.random() * 400;
      } while (Math.sqrt((x - 300) ** 2 + (y - 200) ** 2) < 100);
      
      asteroids.push(createAsteroid(x, y, 3));
    }
  }, [gameState.level, createAsteroid]);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) return;

    const { ship, bullets, asteroids, particles } = gameObjects.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ship controls
    if (keys.current['a'] || keys.current['arrowleft']) {
      ship.angle -= 0.15;
    }
    if (keys.current['d'] || keys.current['arrowright']) {
      ship.angle += 0.15;
    }
    
    ship.thrust = keys.current['w'] || keys.current['arrowup'];
    
    if (ship.thrust) {
      const thrustPower = 0.3;
      ship.dx += Math.cos(ship.angle) * thrustPower;
      ship.dy += Math.sin(ship.angle) * thrustPower;
    }

    // Apply friction
    ship.dx *= 0.98;
    ship.dy *= 0.98;

    // Update ship position
    ship.x += ship.dx;
    ship.y += ship.dy;

    // Wrap ship around screen
    ship.x = (ship.x + canvas.width) % canvas.width;
    ship.y = (ship.y + canvas.height) % canvas.height;

    // Shooting
    if (keys.current[' '] || keys.current['spacebar']) {
      const now = Date.now();
      if (!ship.lastShot || now - ship.lastShot > 150) {
        bullets.push({
          x: ship.x + Math.cos(ship.angle) * ship.size,
          y: ship.y + Math.sin(ship.angle) * ship.size,
          dx: Math.cos(ship.angle) * 8 + ship.dx,
          dy: Math.sin(ship.angle) * 8 + ship.dy,
          life: 60
        });
        ship.lastShot = now;
      }
    }

    // Update bullets
    bullets.forEach((bullet, index) => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;
      bullet.x = (bullet.x + canvas.width) % canvas.width;
      bullet.y = (bullet.y + canvas.height) % canvas.height;
      bullet.life--;
      
      if (bullet.life <= 0) {
        bullets.splice(index, 1);
      }
    });

    // Update asteroids
    asteroids.forEach(asteroid => {
      asteroid.x += asteroid.dx;
      asteroid.y += asteroid.dy;
      asteroid.x = (asteroid.x + canvas.width) % canvas.width;
      asteroid.y = (asteroid.y + canvas.height) % canvas.height;
      asteroid.angle += asteroid.rotation;
    });

    // Update particles
    particles.forEach((particle, index) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.life--;
      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });

    // Collision detection: bullets vs asteroids
    bullets.forEach((bullet, bulletIndex) => {
      asteroids.forEach((asteroid, asteroidIndex) => {
        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < asteroid.size * 8) {
          // Create explosion particles
          for (let i = 0; i < 8; i++) {
            particles.push(createParticle(asteroid.x, asteroid.y, '#ffff00'));
          }
          
          // Score points
          const points = (4 - asteroid.size) * 50;
          setGameState(prev => ({ ...prev, score: prev.score + points }));
          
          // Split asteroid if large enough
          if (asteroid.size > 1) {
            for (let i = 0; i < 2; i++) {
              asteroids.push(createAsteroid(
                asteroid.x, 
                asteroid.y, 
                asteroid.size - 1,
                asteroid.dx + (Math.random() - 0.5) * 2,
                asteroid.dy + (Math.random() - 0.5) * 2
              ));
            }
          }
          
          bullets.splice(bulletIndex, 1);
          asteroids.splice(asteroidIndex, 1);
        }
      });
    });

    // Collision detection: ship vs asteroids
    asteroids.forEach((asteroid, index) => {
      const dx = ship.x - asteroid.x;
      const dy = ship.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < ship.size + asteroid.size * 6) {
        // Create explosion
        for (let i = 0; i < 15; i++) {
          particles.push(createParticle(ship.x, ship.y, '#ff0000'));
        }
        
        setGameState(prev => {
          const newLives = prev.lives - 1;
          return {
            ...prev,
            lives: newLives,
            gameOver: newLives <= 0
          };
        });
        
        // Reset ship position
        ship.x = 300;
        ship.y = 200;
        ship.dx = 0;
        ship.dy = 0;
        ship.angle = 0;
      }
    });

    // Check level completion
    if (asteroids.length === 0) {
      setGameState(prev => ({ ...prev, level: prev.level + 1 }));
      setTimeout(() => {
        initializeLevel();
      }, 1000);
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, createAsteroid, createParticle, initializeLevel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { ship, bullets, asteroids, particles } = gameObjects.current;

    // Clear canvas with space background
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw star field
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73) % canvas.height;
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#00ff00';
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;

    // Draw ship
    if (!gameState.gameOver) {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.beginPath();
      ctx.moveTo(ship.size, 0);
      ctx.lineTo(-ship.size, -ship.size / 2);
      ctx.lineTo(-ship.size / 2, 0);
      ctx.lineTo(-ship.size, ship.size / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Draw thrust
      if (ship.thrust) {
        ctx.strokeStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(-ship.size, -ship.size / 4);
        ctx.lineTo(-ship.size * 2, 0);
        ctx.lineTo(-ship.size, ship.size / 4);
        ctx.stroke();
        ctx.strokeStyle = '#00ff00';
      }
      ctx.restore();
    }

    // Draw bullets
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x - 1, bullet.y - 1, 2, 2);
    });

    // Draw asteroids
    ctx.strokeStyle = '#00ff00';
    asteroids.forEach(asteroid => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.angle);
      ctx.beginPath();
      
      for (let i = 0; i < asteroid.vertices.length; i++) {
        const angle = (i / asteroid.vertices.length) * Math.PI * 2;
        const radius = asteroid.size * 8 * asteroid.vertices[i];
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Draw particles
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
    });

    // Draw HUD
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px MS Sans Serif';
    ctx.fillText(`Score: ${gameState.score}`, 10, 25);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 45);
    ctx.fillText(`Level: ${gameState.level}`, 10, 65);
    ctx.fillText(`Server: ${gameState.serverStatus}`, 10, 85);

    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ff0000';
      ctx.font = '24px MS Sans Serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px MS Sans Serif';
      ctx.fillText(`Final Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 40);
      ctx.textAlign = 'left';
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      isPaused: false, 
      gameOver: false,
      score: 0,
      lives: 3,
      level: 1,
      serverStatus: 'ONLINE'
    }));
    
    // Reset game objects
    const { ship, bullets, asteroids, particles } = gameObjects.current;
    ship.x = 300;
    ship.y = 200;
    ship.angle = 0;
    ship.dx = 0;
    ship.dy = 0;
    bullets.length = 0;
    asteroids.length = 0;
    particles.length = 0;
    
    setTimeout(initializeLevel, 100);
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      showHighScores: false,
      playerName: '',
      serverStatus: 'ONLINE'
    });
  };

  const submitScore = () => {
    if (!gameState.playerName.trim()) {
      alert('Please enter your name to save your score to the server database.');
      return;
    }

    const newScore = {
      name: gameState.playerName.toUpperCase(),
      score: gameState.score,
      timestamp: new Date().toLocaleString()
    };

    setHighScores(prev => {
      const updated = [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
      return updated;
    });

    setGameState(prev => ({ ...prev, playerName: '', showHighScores: true }));
  };

  // Handle restart key
  useEffect(() => {
    if (gameState.gameOver && keys.current['r']) {
      startGame();
    }
  }, [gameState.gameOver]);

  // Start game loop
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

  const buttonStyle = {
    padding: '4px 8px',
    cursor: 'pointer',
    border: '2px outset #c0c0c0',
    background: '#c0c0c0',
    color: '#000',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    marginRight: '4px'
  };

  const inputStyle = {
    border: '2px inset #c0c0c0',
    padding: '2px',
    fontFamily: 'MS Sans Serif, sans-serif',
    fontSize: '11px',
    width: '120px',
    marginRight: '4px'
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
          🚀 Asteroids Network Defense System v2.1
        </h1>
        
        <div style={{ marginBottom: '4px' }}>
          <button 
            style={buttonStyle} 
            onClick={startGame}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            Initialize Defense
          </button>
          <button 
            style={buttonStyle} 
            onClick={pauseGame}
            disabled={!gameState.isPlaying}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            style={buttonStyle} 
            onClick={resetGame}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            Reset
          </button>
          <button 
            style={buttonStyle} 
            onClick={() => setGameState(prev => ({ ...prev, showHighScores: !prev.showHighScores }))}
            onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
          >
            Server Records
          </button>
        </div>

        {gameState.gameOver && (
          <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', marginRight: '4px' }}>Save to server:</span>
            <input
              type="text"
              placeholder="Enter name"
              value={gameState.playerName}
              onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
              style={inputStyle}
              maxLength={12}
            />
            <button
              style={buttonStyle}
              onClick={submitScore}
              onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
              onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
              onMouseLeave={(e) => e.target.style.border = '2px outset #c0c0c0'}
            >
              Upload Score
            </button>
          </div>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        border: '2px inset #c0c0c0', 
        background: '#000033',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '4px',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ 
            border: '1px solid #000',
            background: '#000033'
          }}
        />

        {gameState.showHighScores && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            padding: '8px',
            fontSize: '10px',
            fontFamily: 'MS Sans Serif, sans-serif',
            width: '200px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#000080' }}>
              📊 SERVER HIGH SCORES
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px', color: '#008000' }}>
              Last sync: {new Date().toLocaleTimeString()}
            </div>
            {highScores.map((score, index) => (
              <div key={index} style={{ 
                marginBottom: '2px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{index + 1}. {score.name}</span>
                <span>{score.score.toLocaleString()}</span>
              </div>
            ))}
            <button
              style={{ ...buttonStyle, marginTop: '4px', fontSize: '9px', width: '100%' }}
              onClick={() => setGameState(prev => ({ ...prev, showHighScores: false }))}
              onMouseDown={(e) => e.target.style.border = '2px inset #c0c0c0'}
              onMouseUp={(e) => e.target.style.border = '2px outset #c0c0c0'}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div style={{
        background: '#c0c0c0',
        padding: '4px',
        border: '1px inset #c0c0c0',
        fontSize: '10px',
        fontFamily: 'MS Sans Serif, sans-serif'
      }}>
        <div>Defense Status: {gameState.isPlaying ? 'ACTIVE' : 'STANDBY'} | Threat Level: {gameState.level} | Score: {gameState.score.toLocaleString()}</div>
        <div>Controls: WASD/Arrows to move, SPACEBAR to fire | Server connection: {gameState.serverStatus}</div>
      </div>
    </div>
  );
}

export default AsteroidsGame;