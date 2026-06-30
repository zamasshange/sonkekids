"use client";

import { useRef, useState } from "react";

const COLORS = ["#e5296b", "#2638c4", "#99cf16", "#f7e03b", "#ff8a00", "#8b5cf6"];

export function ColoringPlayer({ title }: { title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);

  function paint(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  return (
    <div className="player-shell">
      <p className="player-message">Click to color the canvas for {title}.</p>
      <div className="color-palette">
        {COLORS.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`color-swatch${color === swatch ? " active" : ""}`}
            style={{ background: swatch }}
            onClick={() => setColor(swatch)}
            aria-label={`Color ${swatch}`}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={180}
        className="color-canvas"
        onClick={paint}
      />
    </div>
  );
}
