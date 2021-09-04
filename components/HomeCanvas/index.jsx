import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import padraoIMG from "../../assets/padrao.jpeg";
import {
  createCanvasFromCoverImg,
  getRandomInt,
  shuffleArray,
} from "../../utils";
import useWindowSize from "../Hooks/useWindowsSize";

const HomeCanvas = () => {
  const canvasRef = useRef();
  const imgRef = useRef();
  const { width, height, isMobile } = useWindowSize();
  const router = useRouter();
  useEffect(() => {
    drawCanvas();
  }, [router.pathname]);

  useEffect(() => {
    drawCanvas();
  }, [width, height]);

  const drawCanvas = () => {
    if (!canvasRef || !imgRef || !width || !height) return;
    const canvas = canvasRef.current;
    const canvasImg = createCanvasFromCoverImg(imgRef.current, width, height);
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const { width: inputW, height: inputH } = canvas;
    const xRows = isMobile ? 10 : 20;
    const pieceW = inputW / xRows;
    const yRows = height / pieceW;
    const pieceH = inputH / yRows;
    const puzzleW = pieceW * xRows;

    let piece,
      xPos = 0,
      yPos = 0;
    let pieces = [];

    for (let i = 0; i < xRows * yRows; i++) {
      piece = {};
      piece.sx = xPos;
      piece.sy = yPos;
      pieces.push(piece);
      xPos += pieceW;
      if (xPos >= inputW) {
        xPos = 0;
        yPos += pieceH;
      }
    }

    pieces = shuffleArray(pieces);
    xPos = 0;
    yPos = 0;

    for (let i = 0; i < pieces.length; i++) {
      piece = pieces[i];
      piece.xPos = xPos;
      piece.yPos = yPos;
      const show = getRandomInt(10);
      if (show > 7)
        ctx.drawImage(
          canvasImg,
          piece.sx,
          piece.sy,
          pieceW,
          pieceH,
          xPos,
          yPos,
          pieceW,
          pieceH
        );
      xPos += pieceW;
      if (xPos >= puzzleW) {
        xPos = 0;
        yPos += pieceH;
      }
    }
  };

  return (
    <div className="home-canvas w-full h-full absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} />
      <img ref={imgRef} src={padraoIMG} className="hidden" />
    </div>
  );
};

export default HomeCanvas;
