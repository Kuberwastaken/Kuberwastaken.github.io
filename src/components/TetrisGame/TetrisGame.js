import React, { useEffect, useRef, useState } from 'react';
import './TetrisGame.css';

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const gameStateRef = useRef({ isOver: false });

  useEffect(() => {
    const savedTopScore = localStorage.getItem('tetrisTopScore');
    if (savedTopScore) setTopScore(parseInt(savedTopScore));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const COLORS = ['#5abb9a', '#ffebcd', '#d4b99c', '#7fffd4', '#bae1ff', '#baffc9', '#ffb3ba'];
    const SHAPES = [
      [[1, 1, 1, 1]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1], [1, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
    ];

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let currentPiece = getRandomPiece();
    let nextPiece = getRandomPiece();
    let dropStart = Date.now();
    let gameInterval;
    let localScore = 0;

    function getRandomPiece() {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return { shape, color, x: Math.floor(COLS / 2) - 1, y: 0 };
    }

    function drawBoard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c]) {
            ctx.fillStyle = board[r][c];
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

    function drawPiece(piece) {
      piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            ctx.fillStyle = piece.color;
            ctx.fillRect((piece.x + c) * BLOCK_SIZE, (piece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeRect((piece.x + c) * BLOCK_SIZE, (piece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        });
      });
    }

    function movePiece(piece, dx, dy) {
      if (gameStateRef.current.isOver) return false;
      piece.x += dx;
      piece.y += dy;
      if (collision(piece)) {
        piece.x -= dx;
        piece.y -= dy;
        return false;
      }
      return true;
    }

    function rotatePiece(piece) {
      if (gameStateRef.current.isOver) return;
      const originalShape = piece.shape.map(row => [...row]);
      const originalX = piece.x;
      const originalY = piece.y;

      const rotated = piece.shape[0].map((_, index) =>
        piece.shape.map(row => row[index]).reverse()
      );

      piece.shape = rotated;

      const kicks = [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 }
      ];

      for (const kick of kicks) {
        piece.x = originalX + kick.x;
        piece.y = originalY + kick.y;
        
        if (!collision(piece)) {
          return;
        }
      }

      piece.shape = originalShape;
      piece.x = originalX;
      piece.y = originalY;
    }

    function collision(piece) {
      return piece.shape.some((row, r) => {
        return row.some((cell, c) => {
          if (cell) {
            const newX = piece.x + c;
            const newY = piece.y + r;
            return newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX]);
          }
          return false;
        });
      });
    }

    function mergePiece(piece) {
      piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            board[piece.y + r][piece.x + c] = piece.color;
          }
        });
      });
    }

    function clearLines() {
      let clearedLines = 0;
      board = board.filter(row => {
        const isFull = row.every(cell => cell);
        if (isFull) clearedLines++;
        return !isFull;
      });
      
      while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
      }

      // Score calculation
      if (clearedLines > 0) {
        const scoreMultiplier = [0, 40, 100, 300, 1200];
        localScore += scoreMultiplier[clearedLines] || 0;
        setScore(localScore);

        // Check for potential high score update
        if (localScore > topScore) {
          setTopScore(localScore);
          localStorage.setItem('tetrisTopScore', localScore.toString());
        }
      }
    }

    function dropPiece() {
      if (gameStateRef.current.isOver) return;
      if (!movePiece(currentPiece, 0, 1)) {
        mergePiece(currentPiece);
        clearLines();
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        if (collision(currentPiece)) {
          gameStateRef.current.isOver = true;
          setGameOver(true);
          if (localScore > topScore) {
            setTopScore(localScore);
            localStorage.setItem('tetrisTopScore', localScore.toString());
          }
          clearInterval(gameInterval);
        }
      }
    }

    function update() {
      if (gameStateRef.current.isOver) return;
      const now = Date.now();
      const delta = now - dropStart;
      if (delta > 1000) {
        dropPiece();
        dropStart = Date.now();
      }
      drawBoard();
      drawPiece(currentPiece);
    }

    function handleKeyPress(e) {
      if (gameStateRef.current.isOver) return;
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(currentPiece, -1, 0);
          e.preventDefault();
          break;
        case 'ArrowRight':
          movePiece(currentPiece, 1, 0);
          e.preventDefault();
          break;
        case 'ArrowDown':
          dropPiece();
          e.preventDefault();
          break;
        case 'ArrowUp':
          rotatePiece(currentPiece);
          e.preventDefault();
          break;
        default:
          break;
      }
    }

    function handleTouch(e) {
      if (gameStateRef.current.isOver) return;
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relX = touch.clientX - rect.left;
      const relY = touch.clientY - rect.top;
      
      // Divide canvas into regions
      const regionWidth = canvas.width / 3;
      const regionHeight = canvas.height / 4;
      
      // Top region - rotate
      if (relY < regionHeight) {
        rotatePiece(currentPiece);
      }
      // Bottom region - drop
      else if (relY > canvas.height - regionHeight) {
        dropPiece();
      }
      // Left region - move left
      else if (relX < regionWidth) {
        movePiece(currentPiece, -1, 0);
      }
      // Right region - move right
      else if (relX > regionWidth * 2) {
        movePiece(currentPiece, 1, 0);
      }
      
      e.preventDefault();
    }

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('touchstart', handleTouch);
    gameInterval = setInterval(update, 50);

    const currentGameState = gameStateRef.current;

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('touchstart', handleTouch);
      clearInterval(gameInterval);
      currentGameState.isOver = false;
    };
  }, [gameOver, score, topScore]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    gameStateRef.current.isOver = false;
  };

  return (
    <div className="tetris-game-container">
      <div className="scoreboard">
        <div>Score: {score}</div>
        <div>Top Score: {topScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width="300"
        height="600"
        className="tetris-game-canvas"
      />
      {gameOver && <div className="game-over">Game Over! Score: {score}</div>}
      <button className="restart-button" onClick={resetGame}>Restart</button>
    </div>
  );
};

export default TetrisGame;