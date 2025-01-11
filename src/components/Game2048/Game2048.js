import React, { useEffect, useState } from 'react';
import './Game2048.css';

const SIZE = 4;
const SWIPE_THRESHOLD = 50;

const getInitialGrid = () => {
  const grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
};

const addRandomTile = (grid) => {
  const emptyTiles = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        emptyTiles.push({ r, c });
      }
    }
  }
  if (emptyTiles.length > 0) {
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
};

const moveLeft = (grid) => {
  let score = 0;
  let moved = false;
  const newGrid = grid.map(row => {
    const filtered = row.filter(cell => cell !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        score += filtered[i];
        filtered.splice(i + 1, 1);
        moved = true;
      }
    }
    while (filtered.length < SIZE) {
      filtered.push(0);
    }
    if (filtered.some((val, idx) => val !== row[idx])) {
      moved = true;
    }
    return filtered;
  });
  return { grid: newGrid, moved, score };
};

const rotateGrid = (grid) => {
  const newGrid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newGrid[c][SIZE - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
};

const moveGrid = (grid, direction) => {
  let newGrid = grid.map(row => [...row]);
  let moved = false;
  let score = 0;
  switch (direction) {
    case 'right':
      newGrid = rotateGrid(rotateGrid(newGrid));
      const rightResult = moveLeft(newGrid);
      newGrid = rotateGrid(rotateGrid(rightResult.grid));
      moved = rightResult.moved;
      score = rightResult.score;
      break;
    case 'up':
      newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)));
      const upResult = moveLeft(newGrid);
      newGrid = rotateGrid(upResult.grid);
      moved = upResult.moved;
      score = upResult.score;
      break;
    case 'down':
      newGrid = rotateGrid(newGrid);
      const downResult = moveLeft(newGrid);
      newGrid = rotateGrid(rotateGrid(rotateGrid(downResult.grid)));
      moved = downResult.moved;
      score = downResult.score;
      break;
    case 'left':
      const leftResult = moveLeft(newGrid);
      newGrid = leftResult.grid;
      moved = leftResult.moved;
      score = leftResult.score;
      break;
  }
  return { grid: newGrid, moved, score };
};

const checkGameOver = (grid) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (
        (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) ||
        (c < SIZE - 1 && grid[r][c] === grid[r][c + 1])
      ) {
        return false;
      }
    }
  }
  return true;
};

const Game2048 = () => {
  const [grid, setGrid] = useState(getInitialGrid());
  const [score, setScore] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleMove = (direction) => {
    if (gameOver) return;
    const { grid: newGrid, moved, score: newScore } = moveGrid([...grid], direction);
    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(score + newScore);
      if (score + newScore > topScore) {
        setTopScore(score + newScore);
      }
      if (checkGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setGrid(getInitialGrid());
    setScore(0);
    setGameOver(false);
  };

  const handleKeyDown = (e) => {
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      const directions = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down'
      };
      handleMove(directions[e.key]);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchEnd = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      setTouchStart(null);
      return;
    }
    
    if (Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
    setTouchStart(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver]);

  return (
    <div 
      className="game-2048-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="scoreboard">
        <div>Score: {score}</div>
        <div>Top Score: {topScore}</div>
      </div>
      <div className="game-2048-grid">
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className={`game-2048-cell value-${cell}`}>
              <div>{cell !== 0 && cell}</div>
            </div>
          ))
        )}
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
      <button onClick={resetGame}>Restart</button>
    </div>
  );
};

export default Game2048;