import React, { useEffect, useRef, useState } from 'react';
import './TetrisGame.css';

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({ isOver: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
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
      board = board.filter(row => row.some(cell => !cell));
      while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
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
          break;
        case 'ArrowRight':
          movePiece(currentPiece, 1, 0);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece(currentPiece);
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

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('touchstart', handleTouch);
      clearInterval(gameInterval);
      gameStateRef.current.isOver = false;
    };
  }, [gameOver]);

  return (
    <div className="tetris-game-container">
      <canvas 
        ref={canvasRef} 
        width="300" 
        height="600" 
        className="tetris-game-canvas"
      />
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default TetrisGame;