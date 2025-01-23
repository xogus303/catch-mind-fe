import { socket } from "@/socket";
import React from "react";

import { useUserStore } from "@/providers/user-store-provider";
import clsx from "clsx";

const DrawCanvas = () => {
  const { userType } = useUserStore((state) => state);
  const [started, setStarted] = React.useState<boolean>(false);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const [currentColor, setCurrentColor] = React.useState<string>("#000");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onGameStart = (word: string) => {
    console.log("onGameStart ???");
    setStarted(true);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    setIsDrawing(true);
    ctx?.beginPath();
    ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      ctx?.lineTo(x, y);
      ctx?.stroke();

      const data = JSON.stringify({ x, y, type: "draw" });
      console.log("draw data", data);
    }
  };
  const endDrawing = () => {
    setIsDrawing(false);
  };

  React.useEffect(() => {
    socket.on("game start", onGameStart);

    return () => {
      socket.off("game start", onGameStart);
    };
  }, []);

  return (
    <div className="flex flex-1">
      <canvas
        ref={canvasRef}
        className={clsx(
          `flex flex-1 ${started ? "cursor-crosshair" : "cursor-wait"}`
        )}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      >
        ㄴㅇㄹㄴㄷㄹ
      </canvas>
    </div>
  );
};

export default DrawCanvas;
