import React, { useEffect, useRef, useState } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;

    const draw = () => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

      ctx.fillStyle = 'green';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
      });

      const newSnake = [...snake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * columns),
          y: Math.floor(Math.random() * rows)
        });
      } else {
        newSnake.pop();
      }

      if (
        head.x < 0 || head.x >= columns ||
        head.y < 0 || head.y >= rows ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(head);
      setSnake(newSnake);
    };

    intervalRef.current = setInterval(draw, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [snake, food, direction, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    const handleTouch = (e) => {
      if (gameOver) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relX = touch.clientX - rect.left;
      const relY = touch.clientY - rect.top;

      const regionWidth = canvas.width / 3;
      const regionHeight = canvas.height / 3;

      if (relY < regionHeight) {
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
      } else if (relY > canvas.height - regionHeight) {
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
      } else if (relX < regionWidth) {
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
      } else if (relX > canvas.width - regionWidth) {
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
      }

      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouch);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', handleTouch);
      }
    };
  }, [direction, gameOver]);

  return (
    <div className="snake-game-container">
      <canvas ref={canvasRef} width="400" height="400" className="snake-game-canvas"></canvas>
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default React.memo(SnakeGame);