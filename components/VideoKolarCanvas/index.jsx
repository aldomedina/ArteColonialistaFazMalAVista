import { useRef, useEffect, useState } from "react";
import { shuffleArray } from "../../utils";
import useAnimationFrame from "../Hooks/useAnimationFrame";
import styled from "styled-components";

const SCanvas = styled.canvas`
  transform: ${({ modifier }) =>
    `scale(${modifier.aspectRatio > 1 ? modifier.width : modifier.height})`};
`;

const VideoKolarCanvas = ({
  videoRef,
  screenH,
  screenW,
  areMonuments,
  videoConstraints,
}) => {
  const canvasRef = useRef(null);
  const [pieces, setPieces] = useState([]);
  const [settings, setSettings] = useState({});
  const [firstOrder, setFirstOrder] = useState([]);
  const [sizeModifier, setSizeModifier] = useState(1);

  useEffect(() => {
    // 1. initialize settings
    if (!canvasRef || !screenW || !screenH || !videoConstraints.width) return;
    const canvas = canvasRef.current;
    const { width: canvasW, height: canvasH, aspectRatio } = videoConstraints;
    canvas.width = canvasW;
    canvas.height = canvasH;
    aspectRatio > 1
      ? setSizeModifier({
          width: screenW / canvasW,
          height: screenH / canvasH,
          aspectRatio: innerWidth / screenW,
        })
      : setSizeModifier({
          width: screenW / canvasW,
          height: screenH / canvasH,
          aspectRatio: innerHeight / screenH,
        });

    const xRows = screenW < 768 ? 10 : 20;
    const pieceW = canvasW / xRows;
    const yRows = canvasH / pieceW;
    const pieceH = canvasH / yRows;
    const puzzleW = pieceW * xRows;
    let piece,
      xPos = 0,
      yPos = 0;
    const copyPieces = [];

    // 2. create pieces
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

  // 3. Kolarize
  useEffect(() => {
    if (firstOrder.length && pieces.length) {
      areMonuments ? setPieces(shuffleArray(pieces)) : setPieces(firstOrder);
    }
  }, [areMonuments]);

  // 4. Draw in canvas
  useAnimationFrame(() => grabFrame());
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
  };

  return (
    <div
      className="absolute left-5 top-5 flex justify-center items-center overflow-hidden"
      style={{ height: screenH - 10, width: screenW - 10 }}
    >
      <SCanvas className="-z-10" ref={canvasRef} modifier={sizeModifier} />
    </div>
  );
};

export default VideoKolarCanvas;
