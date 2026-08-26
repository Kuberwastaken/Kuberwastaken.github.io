import React, { useEffect, useId, useState } from 'react';

const KM_BITS = [
  '10001001000001',
  '10010001100011',
  '10100001010101',
  '11000001001001',
  '10100001000001',
  '10010001000001',
  '10001001000001'
];

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
};

const TuiBrandMark = ({ scale = 2.25, className = '' }) => {
  const uid = useId().replace(/[^a-z0-9]/gi, '');
  const reducedMotion = useReducedMotion();
  const columns = KM_BITS[0].length;
  const rows = KM_BITS.length;
  const cell = 10;
  const dot = 6;
  const offset = (cell - dot) / 2;
  const width = columns * cell;
  const height = rows * cell;

  const pixels = [];
  KM_BITS.forEach((row, y) => {
    for (let x = 0; x < columns; x += 1) {
      if (row[x] === '1') {
        pixels.push(
          <rect
            key={`${x}-${y}`}
            x={x * cell + offset}
            y={y * cell + offset}
            width={dot}
            height={dot}
            rx="1"
          />
        );
      }
    }
  });

  return (
    <svg
      aria-hidden="true"
      width={columns * scale}
      height={rows * scale}
      viewBox={`0 0 ${width} ${height}`}
      className={`tui-brand-mark ${className}`.trim()}
    >
      <defs>
        <mask id={`km-mask-${uid}`}>
          <g fill="#fff">{pixels}</g>
        </mask>
        <linearGradient
          id={`km-glimmer-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width * 0.48}
          y2={height * 0.22}
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#344b43" />
          <stop offset="0.5" stopColor="#5abb9a" />
          <stop offset="1" stopColor="#d8fff2" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from={`${-width * 0.4} ${-height * 0.15}`}
              to={`${width * 0.95} ${height * 0.4}`}
              dur="3.2s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <rect
        width={width}
        height={height}
        fill={`url(#km-glimmer-${uid})`}
        mask={`url(#km-mask-${uid})`}
      />
    </svg>
  );
};

export default React.memo(TuiBrandMark);
