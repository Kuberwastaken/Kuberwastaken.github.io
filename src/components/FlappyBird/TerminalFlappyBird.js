import React, { useState, useEffect } from 'react';
import './TerminalFlappyBird.css';

const TerminalFlappyBird = () => {
  const [birdPosition, setBirdPosition] = useState(125); // Adjusted initial position for mobile
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  
  const isMobile = window.innerWidth <= 768;
  const GRAVITY = isMobile ? 0.4 : 0.8; // Adjusted gravity for mobile
  const JUMP_FORCE = isMobile ? -6 : -12; // Adjusted jump force for mobile
  const PIPE_SPEED = 4;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const BIRD_SIZE = isMobile ? 10 : 20; // Adjusted bird size for mobile
  const GAME_HEIGHT = isMobile ? 250 : 500;
  const GAME_WIDTH = isMobile ? 300 : 800;

  // Initialize game
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, []);

  // Main game loop
  useEffect(() => {
    let frameId;
    let pipeSpawnTimer = 0;
    
    const gameLoop = () => {
      if (!gameHasStarted || gameOver) {
        return;
      }

      // Update bird physics
      setVelocity(v => v + GRAVITY);
      setBirdPosition(pos => {
        const newPos = pos + velocity;
        
        if (newPos > GAME_HEIGHT - BIRD_SIZE || newPos < 0) {
          endGame();
          return pos;
        }
        
        return newPos;
      });

      // Update and spawn pipes
      setPipes(currentPipes => {
        // Move existing pipes
        const updatedPipes = currentPipes
          .map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED
          }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        // Check if we need to spawn a new pipe
        if (currentPipes.length === 0 || 
            currentPipes[currentPipes.length - 1].x < GAME_WIDTH - 300) {
          const newHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
          updatedPipes.push({
            id: Date.now(),
            x: GAME_WIDTH,
            height: newHeight,
            passed: false
          });
        }

        // Update score
        updatedPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x < 50 - PIPE_WIDTH) {
            setScore(s => s + 1);
            pipe.passed = true;
          }
        });

        return updatedPipes;
      });

      // Check collisions
      const birdRect = {
        left: 50,
        right: 50 + BIRD_SIZE,
        top: birdPosition,
        bottom: birdPosition + BIRD_SIZE
      };

      pipes.forEach(pipe => {
        const upperPipeRect = {
          left: pipe.x,
          right: pipe.x + PIPE_WIDTH,
          top: 0,
          bottom: pipe.height
        };

        const lowerPipeRect = {
          left: pipe.x,
          right: pipe.x + PIPE_WIDTH,
          top: pipe.height + PIPE_GAP,
          bottom: GAME_HEIGHT
        };

        if (checkCollision(birdRect, upperPipeRect) || 
            checkCollision(birdRect, lowerPipeRect)) {
          endGame();
        }
      });

      frameId = requestAnimationFrame(gameLoop);
    };

    if (gameHasStarted && !gameOver) {
      frameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [gameHasStarted, gameOver, velocity, pipes]);

  const checkCollision = (rect1, rect2) => {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
  };

  const jump = () => {
    if (gameOver) {
      resetGame();
      return;
    }
    
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    
    setVelocity(JUMP_FORCE);
  };

  const endGame = () => {
    setGameOver(true);
    setGameHasStarted(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score);
    }
  };

  const resetGame = () => {
    setBirdPosition(125); // Adjusted initial position for mobile
    setPipes([]);
    setScore(0);
    setVelocity(0);
    setGameOver(false);
    setGameHasStarted(false);
  };

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="scoreboard">
          <div className="score">Score: {score}</div>
          <div className="score">High Score: {highScore}</div>
        </div>
        
        <div 
          className="game-area"
          onClick={jump}
          onTouchStart={jump}
          style={{
            width: isMobile ? '100%' : `${GAME_WIDTH}px`,
            height: isMobile ? '250px' : `${GAME_HEIGHT}px`,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#000',
            color: '#56b494',
            fontFamily: 'monospace',
            border: '2px solid #56b494',
            padding: '10px'
          }}
        >
          <div 
            className="bird"
            style={{ 
              position: 'absolute',
              left: '50px',
              top: `${birdPosition}px`,
              width: isMobile ? '10px' : `${BIRD_SIZE}px`,
              height: isMobile ? '10px' : `${BIRD_SIZE}px`,
              backgroundColor: '#ffebcd',
              borderRadius: '50%',
              transform: `rotate(${velocity * 2}deg)`,
              transition: 'transform 0.1s',
            }}
          />
          
          {pipes.map(pipe => (
            <React.Fragment key={pipe.id}>
              <div 
                style={{ 
                  position: 'absolute',
                  left: `${pipe.x}px`,
                  top: '0',
                  width: isMobile ? '30px' : `${PIPE_WIDTH}px`,
                  height: `${pipe.height}px`,
                  backgroundColor: '#56b494',
                }}
              />
              <div 
                style={{ 
                  position: 'absolute',
                  left: `${pipe.x}px`,
                  top: `${pipe.height + PIPE_GAP}px`,
                  width: isMobile ? '30px' : `${PIPE_WIDTH}px`,
                  height: `${GAME_HEIGHT - (pipe.height + PIPE_GAP)}px`,
                  backgroundColor: '#56b494',
                }}
              />
            </React.Fragment>
          ))}

          {(gameOver || !gameHasStarted) && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#56b494',
              fontSize: '24px',
              fontFamily: 'monospace'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '20px' }}>
                {gameOver ? 'GAME OVER' : 'TERMINAL BIRD'}
              </div>
              {gameOver && (
                <>
                  <div>Score: {score}</div>
                  <div>High Score: {highScore}</div>
                </>
              )}
              <div style={{ fontSize: '18px', marginTop: '20px' }}>
                {isMobile ? "Tap" : "Press SPACE"} to {gameOver ? "play again" : "start"}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          {isMobile 
            ? "Tap anywhere to make the bird jump"
            : " "
          }
        </div>
      </div>
    </div>
  );
};

export default TerminalFlappyBird;