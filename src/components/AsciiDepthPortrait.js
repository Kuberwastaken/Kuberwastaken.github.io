import React, { useEffect, useRef } from 'react';
import '../App.css';

const GLYPHS = ' .,:;irsXA253hMHGS#9B&@';
const GREEN = '#5abb9a';
const ASSET_PATH = `${process.env.PUBLIC_URL}/ascii-head.bin`;

const AsciiDepthPortrait = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const motionQuery = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px), (prefers-reduced-motion: reduce)');
    const state = {
      points: [],
      aspect: 0.9,
      width: 1,
      height: 1,
      yaw: 0,
      pitch: 0,
      offsetX: 0,
      offsetY: 0,
      targetYaw: 0,
      targetPitch: 0,
      targetOffsetX: 0,
      targetOffsetY: 0,
      staticMode: motionQuery.matches,
      frame: 0,
      cancelled: false
    };

    const draw = () => {
      if (!state.points.length) return;
      context.clearRect(0, 0, state.width, state.height);

      const cosineYaw = Math.cos(state.yaw);
      const sineYaw = Math.sin(state.yaw);
      const cosinePitch = Math.cos(state.pitch);
      const sinePitch = Math.sin(state.pitch);
      const scale = Math.min(
        state.width / (state.aspect * 2.08),
        state.height / 2.08
      );
      const fontSize = Math.max(3, scale / 34);

      context.fillStyle = GREEN;
      context.font = `${fontSize}px 'Geist Mono', ui-monospace, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      state.points.forEach((point) => {
        const x = point.x * state.aspect;
        const rotatedX = x * cosineYaw + point.z * sineYaw;
        const yawZ = -x * sineYaw + point.z * cosineYaw;
        const rotatedY = point.y * cosinePitch - yawZ * sinePitch;
        const rotatedZ = point.y * sinePitch + yawZ * cosinePitch;
        const perspective = 3.6 / (3.6 - rotatedZ);
        const screenX = state.width * 0.5 + rotatedX * scale * perspective + state.offsetX;
        const screenY = state.height * 0.5 - rotatedY * scale * perspective + state.offsetY;

        context.globalAlpha = point.opacity;
        context.fillText(point.glyph, screenX, screenY);
      });
      context.globalAlpha = 1;
    };

    const animate = () => {
      state.frame = 0;
      if (state.cancelled) return;
      const easing = 0.12;
      state.yaw += (state.targetYaw - state.yaw) * easing;
      state.pitch += (state.targetPitch - state.pitch) * easing;
      state.offsetX += (state.targetOffsetX - state.offsetX) * easing;
      state.offsetY += (state.targetOffsetY - state.offsetY) * easing;
      draw();

      const remaining = Math.abs(state.targetYaw - state.yaw)
        + Math.abs(state.targetPitch - state.pitch)
        + Math.abs(state.targetOffsetX - state.offsetX) * 0.01
        + Math.abs(state.targetOffsetY - state.offsetY) * 0.01;
      if (remaining > 0.0005) state.frame = window.requestAnimationFrame(animate);
    };

    const requestDraw = () => {
      if (!state.frame) state.frame = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      state.width = Math.max(bounds.width, 1);
      state.height = Math.max(bounds.height, 1);
      canvas.width = Math.round(state.width * pixelRatio);
      canvas.height = Math.round(state.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    };

    const reset = () => {
      state.targetYaw = 0;
      state.targetPitch = 0;
      state.targetOffsetX = 0;
      state.targetOffsetY = 0;
      requestDraw();
    };

    const handlePointerMove = (event) => {
      if (state.staticMode) return;
      const bounds = canvas.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / (window.innerWidth * 0.45)));
      const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / (window.innerHeight * 0.45)));
      state.targetYaw = x * 0.16;
      state.targetPitch = y * 0.1;
      state.targetOffsetX = x * 2.5;
      state.targetOffsetY = y * 2;
      requestDraw();
    };

    const handleMotionChange = (event) => {
      state.staticMode = event.matches;
      if (state.staticMode) reset();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('blur', reset);
    motionQuery.addEventListener('change', handleMotionChange);

    fetch(ASSET_PATH)
      .then((response) => {
        if (!response.ok) throw new Error(`ASCII portrait returned ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        if (state.cancelled) return;
        const view = new DataView(buffer);
        const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
        const count = view.getUint16(4, true);
        const recordSize = view.getUint16(6, true);
        if (magic !== 'AHD1' || recordSize !== 8) throw new Error('Invalid ASCII portrait data');
        state.aspect = view.getFloat32(8, true);
        state.points = Array.from({ length: count }, (_, index) => {
          const offset = 12 + index * recordSize;
          const luminance = view.getUint8(offset + 6) / 255;
          return {
            x: view.getInt16(offset, true) / 32767,
            y: view.getInt16(offset + 2, true) / 32767,
            z: view.getInt16(offset + 4, true) / 32767 * 0.34,
            glyph: GLYPHS[1 + Math.min(GLYPHS.length - 2, Math.floor(luminance * (GLYPHS.length - 1)))],
            opacity: 0.28 + luminance * 0.66
          };
        }).sort((a, b) => a.z - b.z);
        resize();
      })
      .catch((error) => {
        console.error(error);
        canvas.classList.add('ascii-depth-error');
      });

    return () => {
      state.cancelled = true;
      if (state.frame) window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', reset);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div className="ascii-depth-portrait" role="img" aria-label="Interactive ASCII depth portrait of Kuber Mehta">
      <canvas ref={canvasRef} />
    </div>
  );
});

export default AsciiDepthPortrait;
