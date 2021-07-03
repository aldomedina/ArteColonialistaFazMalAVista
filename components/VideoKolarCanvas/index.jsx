import { useRef, useEffect, useState } from "react";
import { shuffleArray } from "../../utils";
import useAnimationFrame from "../Hooks/useAnimationFrame";

const VideoKolarCanvas = ({ videoRef, screenH, screenW, areMonuments }) => {
  const canvasRef = useRef(null);
  const [pieces, setPieces] = useState([]);
  const [settings, setSettings] = useState({});
  const [firstOrder, setFirstOrder] = useState([]);

  useEffect(() => {
    if (!canvasRef || !screenW || !screenH) return;
    const canvas = canvasRef.current;
    const canvasW = screenW - 10;
    const canvasH = screenH - 10;
    canvas.width = canvasW;
    canvas.height = canvasH;

    // settings

    const xRows = screenW < 768 ? 10 : 20;
    const pieceW = canvasW / xRows;
    const yRows = canvasH / pieceW;
    const pieceH = canvasH / yRows;
    const puzzleW = pieceW * xRows;
    let piece,
      xPos = 0,
      yPos = 0;
    const copyPieces = [];

    // create and shuffle pieces
    for (let i = 0; i < xRows * yRows; i++) {
      piece = {};
      piece.sx = xPos;
      piece.sy = yPos;
      copyPieces.push(piece);
      xPos += pieceW;
      if (xPos >= canvasW) {
        xPos = 0;
        yPos += pieceH;
      }
    }
    setFirstOrder(copyPieces);
    setPieces(copyPieces);
    setSettings({
      canvasW,
      canvasH,
      pieceW,
      pieceH,
      puzzleW,
    });
  }, []);

  useEffect(() => {
    if (firstOrder.length && pieces.length) {
      console.log("areMonuments", areMonuments);
      areMonuments ? setPieces(shuffleArray(pieces)) : setPieces(firstOrder);
    }
  }, [areMonuments]);

  useAnimationFrame(() => grabFrame());
  let one = 1;
  const grabFrame = () => {
    if (!canvasRef || !videoRef) return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !videoInput) return;
    const ctx = canvas.getContext("2d");
    const { pieceW, pieceH, puzzleW } = settings;
    let piece = {},
      xPos = 0,
      yPos = 0;

    for (let i = 0; i < pieces.length; i++) {
      piece = pieces[i];
      piece.xPos = xPos;
      piece.yPos = yPos;
      ctx.drawImage(
        videoInput,
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
    // if (one) {
    //   console.log(pieces);
    // }
    // one = 0;
  };

  return <canvas className="absolute left-5 top-5 -z-10" ref={canvasRef} />;
};

export default VideoKolarCanvas;
