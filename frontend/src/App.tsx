import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addLine, setLines } from './store';

const wsUrl = 'ws://localhost:4000';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null); // Store ws instance for access in handlers
  const dispatch = useDispatch();
  const lines = useSelector((state: RootState) => state.whiteboard.lines);

  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'draw') {
        dispatch(addLine(data.line));
      }
    };

    // Initial fetch of whiteboard state
    fetch('/api/whiteboard')
      .then(res => res.json())
      .then(data => dispatch(setLines(data.state || [])));

    return () => ws.close();
  }, [dispatch]);

  // Draw all lines on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach((line: any) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
  }, [lines]);

  function getCanvasCoords(e: React.MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDrawing(true);
    setStart(getCanvasCoords(e));
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!drawing || !start) return;
    setDrawing(false);
    const end = getCanvasCoords(e);
    const line = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
    dispatch(addLine(line));
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'draw', line }));
    }
    setStart(null);
  }

  function handleMouseLeave() {
    setDrawing(false);
    setStart(null);
  }

  return (
    <div>
      <h1>Smart Team Retro Dashboard</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
      ></canvas>
      {/* Render existing lines */}
      <ul>
        {lines.map((line, idx) => (
          <li key={idx}>{JSON.stringify(line)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;