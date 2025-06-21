import React, { useEffect, useRef, useState, useCallback } from 'react';
import './GameOfLife.css';

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  getNeighbors() {
    let neighbors = [];
    neighbors.push(new Cell(this.i - 1, this.j - 1));
    neighbors.push(new Cell(this.i - 1, this.j));
    neighbors.push(new Cell(this.i - 1, this.j + 1));
    neighbors.push(new Cell(this.i, this.j - 1));
    neighbors.push(new Cell(this.i, this.j + 1));
    neighbors.push(new Cell(this.i + 1, this.j - 1));
    neighbors.push(new Cell(this.i + 1, this.j));
    neighbors.push(new Cell(this.i + 1, this.j + 1));
    return neighbors;
  }

  toString() {
    return `${this.i},${this.j}`;
  }
}

class Game {
  constructor() {
    this.cells = new Map();
  }

  born(cell) {
    this.cells.set(cell.toString(), cell);
  }

  kill(cell) {
    this.cells.delete(cell.toString());
  }

  isAlive(cell) {
    return this.cells.has(cell.toString());
  }

  getAliveNeighbors(cell) {
    var aliveNeighbors = [];
    for (const neighbor of cell.getNeighbors()) {
      if (this.isAlive(neighbor)) {
        aliveNeighbors.push(neighbor);
      }
    }
    return aliveNeighbors;
  }

  toggleCell(i, j) {
    let cell = new Cell(i, j);
    if (this.isAlive(cell)) {
      this.kill(cell);
    } else {
      this.born(cell);
    }
  }

  step() {
    let toBeAnalyzed = new Map();

    for (const cell of this.cells.values()) {
      toBeAnalyzed.set(cell.toString(), cell);
      for (const neighbor of cell.getNeighbors()) {
        toBeAnalyzed.set(neighbor.toString(), neighbor);
      }
    }

    var nextStates = [];

    for (const cell of toBeAnalyzed.values()) {
      var nAliveNeighbors = this.getAliveNeighbors(cell).length;

      // Any live cell with fewer than two live neighbors dies (underpopulation)
      if (this.isAlive(cell) && nAliveNeighbors < 2) {
        nextStates.push({ cell, next: "dead" });
      }
      // Any live cell with more than three live neighbors dies (overpopulation)
      else if (this.isAlive(cell) && nAliveNeighbors > 3) {
        nextStates.push({ cell, next: "dead" });
      }
      // Any dead cell with exactly three live neighbors becomes alive (reproduction)
      else if (nAliveNeighbors === 3) {
        nextStates.push({ cell, next: "alive" });
      }
      // Any live cell with two or three live neighbors lives on (survival)
    }

    var that = this;
    nextStates.forEach(function (state) {
      if (state.next === "dead") {
        that.kill(state.cell);
      } else if (state.next === "alive") {
        that.born(state.cell);
      }
    });
  }

  clear() {
    this.cells.clear();
  }

  getCells() {
    return Array.from(this.cells.values());
  }
}

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(new Game());
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // milliseconds
  const [generation, setGeneration] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  
  const cellSize = 8;
  const canvasWidth = 600;
  const canvasHeight = 400;
  const cols = Math.floor(canvasWidth / cellSize);
  const rows = Math.floor(canvasHeight / cellSize);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }
    }

    // Draw alive cells
    ctx.fillStyle = '#5abb9a';
    gameRef.current.getCells().forEach(cell => {
      const x = cell.j * cellSize;
      const y = cell.i * cellSize;
      if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight) {
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    });
  }, [showGrid, cellSize, cols, rows, canvasWidth, canvasHeight]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      gameRef.current.toggleCell(row, col);
      draw();
    }
  }, [draw, cellSize, cols, rows]);

  const handleCanvasTouch = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      gameRef.current.toggleCell(row, col);
      draw();
    }
  }, [draw, cellSize, cols, rows]);

  const step = useCallback(() => {
    const beforePopulation = gameRef.current.getCells().length;
    gameRef.current.step();
    const afterPopulation = gameRef.current.getCells().length;
    
    setGeneration(prev => prev + 1);
    
    // If population goes to 0, pause the game
    if (afterPopulation === 0 && beforePopulation > 0) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      setStatusMessage('All cells died - evolution stopped');
      setTimeout(() => setStatusMessage(''), 3000);
    }
    
    draw();
  }, [draw]);

  const play = useCallback(() => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(step, speed);
      setIsPlaying(true);
    }
  }, [isPlaying, step, speed]);

  const clear = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    gameRef.current.clear();
    setGeneration(0);
    draw();
  }, [draw]);

  const addRandomCells = useCallback(() => {
    // Clear existing cells first
    gameRef.current.clear();
    setGeneration(0);
    
    // Create multiple small clusters and some known stable patterns
    const numClusters = 6;
    
    // Add some random clusters
    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerRow = Math.floor(Math.random() * (rows - 8)) + 4;
      const centerCol = Math.floor(Math.random() * (cols - 8)) + 4;
      
      // Create denser clusters with higher survival chance
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if (Math.random() < 0.5) { // 50% chance for each cell in cluster
            const row = centerRow + i;
            const col = centerCol + j;
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
              gameRef.current.born(new Cell(row, col));
            }
          }
        }
      }
    }
    
    // Add a few guaranteed stable patterns for more interesting evolution
    const stablePatterns = [
      // Block (2x2 square - completely stable)
      { row: Math.floor(rows * 0.7), col: Math.floor(cols * 0.2), pattern: [[0,0], [0,1], [1,0], [1,1]] },
      // Tub (stable pattern)
      { row: Math.floor(rows * 0.3), col: Math.floor(cols * 0.8), pattern: [[0,1], [1,0], [1,2], [2,1]] },
      // Beehive (stable pattern)
      { row: Math.floor(rows * 0.8), col: Math.floor(cols * 0.6), pattern: [[0,1], [0,2], [1,0], [1,3], [2,1], [2,2]] }
    ];
    
    stablePatterns.forEach(({ row: startRow, col: startCol, pattern }) => {
      pattern.forEach(([offsetRow, offsetCol]) => {
        const row = startRow + offsetRow;
        const col = startCol + offsetCol;
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
          gameRef.current.born(new Cell(row, col));
        }
      });
    });
    
    setStatusMessage(`Added ${gameRef.current.getCells().length} cells (clusters + stable patterns)`);
    setTimeout(() => setStatusMessage(''), 2000);
    draw();
  }, [draw, rows, cols]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(step, speed);
    }
  }, [speed, step, isPlaying]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="gameoflife-container">
      <div className="gameoflife-header">
        <h3 style={{ color: '#5abb9a', marginBottom: '10px' }}>Kuber's Game of Life</h3>
        <p style={{ color: '#ffebcd', fontSize: '14px', marginBottom: '15px' }}>
          Click cells to toggle them, use preset patterns, then press Play to watch evolution!
        </p>
      </div>

      <div className="gameoflife-controls">
        <button 
          className="gameoflife-btn" 
          onClick={play}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button 
          className="gameoflife-btn" 
          onClick={step}
          disabled={isPlaying}
        >
          ⏭️ Step
        </button>
        
        <button 
          className="gameoflife-btn" 
          onClick={clear}
        >
          🗑️ Clear
        </button>
        
        <button 
          className="gameoflife-btn" 
          onClick={addRandomCells}
        >
          🎲 Random
        </button>
      </div>

      <div className="gameoflife-settings">
        <div className="speed-controls">
          <label style={{ color: '#ffebcd', marginRight: '10px' }}>Speed:</label>
          <button 
            className={`gameoflife-speed-btn ${speed === 400 ? 'active' : ''}`}
            onClick={() => setSpeed(400)}
          >
            Slow
          </button>
          <button 
            className={`gameoflife-speed-btn ${speed === 200 ? 'active' : ''}`}
            onClick={() => setSpeed(200)}
          >
            Normal
          </button>
          <button 
            className={`gameoflife-speed-btn ${speed === 100 ? 'active' : ''}`}
            onClick={() => setSpeed(100)}
          >
            Fast
          </button>
        </div>
        
        <label className="grid-toggle">
          <input 
            type="checkbox" 
            checked={showGrid} 
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <span style={{ color: '#ffebcd', marginLeft: '5px' }}>Show Grid</span>
        </label>
      </div>

      <div className="gameoflife-stats">
        <span style={{ color: '#5abb9a' }}>Generation: {generation}</span>
        <span style={{ color: '#5abb9a', marginLeft: '20px' }}>
          Population: {gameRef.current?.getCells().length || 0}
        </span>
        {statusMessage && (
          <span style={{ color: '#ffcc00', marginLeft: '20px', fontSize: '12px' }}>
            {statusMessage}
          </span>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="gameoflife-canvas"
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasTouch}
      />

      <div className="gameoflife-instructions">
        <p style={{ color: '#888', fontSize: '12px', textAlign: 'center' }}>
          Rules: (1) Live cell with &lt;2 neighbors dies (2) Live cell with 2-3 neighbors survives 
          (3) Live cell with &gt;3 neighbors dies (4) Dead cell with exactly 3 neighbors becomes alive
        </p>
      </div>
    </div>
  );
};

export default React.memo(GameOfLife); 