"use client";

import { useEffect, useRef, useState } from "react";

export function MazePlayer({ title }: { title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [won, setWon] = useState(false);
  const pos = useRef({ x: 20, y: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff6b0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#2638c4";
      ctx.fillRect(80, 0, 20, 140);
      ctx.fillRect(0, 80, 180, 20);
      ctx.fillRect(140, 60, 20, 120);

      ctx.fillStyle = "#e5296b";
      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#99cf16";
      ctx.fillRect(250, 150, 30, 30);
    }

    draw();

    function onKey(event: KeyboardEvent) {
      if (!canvas) return;
      const step = 8;
      if (event.key === "ArrowUp") pos.current.y -= step;
      if (event.key === "ArrowDown") pos.current.y += step;
      if (event.key === "ArrowLeft") pos.current.x -= step;
      if (event.key === "ArrowRight") pos.current.x += step;
      pos.current.x = Math.max(12, Math.min(canvas.width - 12, pos.current.x));
      pos.current.y = Math.max(12, Math.min(canvas.height - 12, pos.current.y));
      draw();
      if (pos.current.x > 245 && pos.current.y > 145) setWon(true);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="player-shell">
      <p className="player-message">
        {won ? "You escaped the maze!" : `Use arrow keys to play ${title}.`}
      </p>
      <canvas ref={canvasRef} width={300} height={180} className="maze-canvas" />
    </div>
  );
}
