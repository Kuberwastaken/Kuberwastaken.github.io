import React, { useEffect, useRef } from 'react';
import './HollywoodEffect.css';

const HollywoodEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = Array(256).join(1).split('');
    const fontSize = 10;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      letters.forEach((y, index) => {
        const text = String.fromCharCode(3e4 + Math.random() * 33);
        const x = index * fontSize;
        ctx.fillText(text, x, y);
        letters[index] = y > 758 + Math.random() * 1e4 ? 0 : y + fontSize;
      });
    };

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="hollywood-effect"></canvas>;
};

export default HollywoodEffect;