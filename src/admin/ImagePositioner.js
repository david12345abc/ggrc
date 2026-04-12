import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiCheck, FiX, FiMove } from 'react-icons/fi';

const FRAME_SIZES = {
  team:           { w: 260, h: 300 },
  hero:           { w: 300, h: 400 },
  blog:           { w: 350, h: 260 },
  steps:          { w: 300, h: 240 },
  services:       { w: 500, h: 280 },
  card_grid:      { w: 320, h: 200 },
  card_carousel:  { w: 320, h: 200 },
  about_teaser:   { w: 350, h: 260 },
  about_tech:     { w: 400, h: 225 },
  testimonials:   { w: 320, h: 200 },
};

const DEFAULT_SIZE = { w: 400, h: 250 };

const ImagePositioner = ({ src, initialPosition, onConfirm, onCancel, sectionType }) => {
  const [posX, setPosX] = useState(initialPosition?.x ?? 50);
  const [posY, setPosY] = useState(initialPosition?.y ?? 50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const size = FRAME_SIZES[sectionType] || DEFAULT_SIZE;

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, px: posX, py: posY };
    frameRef.current?.setPointerCapture(e.pointerId);
  }, [posX, posY]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const sensitivity = 0.35;
    const newX = Math.max(0, Math.min(100, startRef.current.px - (dx / rect.width) * 100 * sensitivity));
    const newY = Math.max(0, Math.min(100, startRef.current.py - (dy / rect.height) * 100 * sensitivity));
    setPosX(newX);
    setPosY(newY);
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      const up = () => setDragging(false);
      window.addEventListener('pointerup', up);
      return () => window.removeEventListener('pointerup', up);
    }
  }, [dragging]);

  return (
    <div className="img-positioner-overlay" onClick={onCancel}>
      <div
        className="img-positioner"
        style={{ maxWidth: size.w + 48 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="img-positioner__header">
          <FiMove style={{ marginRight: 6 }} />
          <span>Drag the image to position it</span>
        </div>

        <div className="img-positioner__frame-wrap">
          <div
            ref={frameRef}
            className={`img-positioner__frame ${dragging ? 'img-positioner__frame--dragging' : ''}`}
            style={{ width: size.w, height: size.h }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <img
              src={src}
              alt=""
              className="img-positioner__img"
              style={{ objectPosition: `${posX}% ${posY}%` }}
              draggable={false}
            />
            <div className="img-positioner__crosshair" />
          </div>
        </div>

        <div className="img-positioner__controls">
          <label className="img-positioner__slider-label">
            Horizontal
            <input
              type="range" min="0" max="100" value={Math.round(posX)}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="img-positioner__slider"
            />
          </label>
          <label className="img-positioner__slider-label">
            Vertical
            <input
              type="range" min="0" max="100" value={Math.round(posY)}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="img-positioner__slider"
            />
          </label>
        </div>

        <div className="img-positioner__actions">
          <button className="admin-btn" onClick={onCancel}>
            <FiX /> Cancel
          </button>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => onConfirm({ x: Math.round(posX), y: Math.round(posY) })}
          >
            <FiCheck /> Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePositioner;
