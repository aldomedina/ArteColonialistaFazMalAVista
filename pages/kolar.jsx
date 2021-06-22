import { useEffect, useRef, useState } from "react";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
import { shuffleArray } from "../utils";
import styled from "styled-components";

const SCanvas = styled.canvas`
  transform: ${({ modifier }) => `scale(${modifier})`};
`;
const pieceSize = 10;

const KolarPage = () => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({});
  const [sizeModifier, setSizeModifier] = useState(1);
  const [pieces, setPieces] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    navigator?.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        const { height, width, aspectRatio } = stream
          .getVideoTracks()[0]
          .getSettings();
        setVideoConstraints({ height, width, aspectRatio });
      });
  }, []);

  useEffect(() => {
    // kolar uniques
    const { width: inputW, height: inputH } = canvasRef.current;
    const pieceW = inputW / pieceSize;
    const pieceH = inputH / pieceSize;
    const puzzleW = pieceW * pieceSize;
    const puzzleH = pieceH * pieceSize;
    setSettings({
      inputW,
      inputH,
      pieceW,
      pieceH,
      puzzleW,
      puzzleH,
    });

    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      const { height, width, aspectRatio } = videoConstraints;
      aspectRatio > 1
        ? setSizeModifier(innerWidth / width)
        : setSizeModifier(innerHeight / height);
    }
  }, [videoConstraints]);

  useEffect(() => {
    const { inputW, inputH, pieceW, pieceH, puzzleW, puzzleH } = settings;
    let piece,
      xPos = 0,
      yPos = 0;
    const copyPieces = [];

    for (let i = 0; i < pieceSize * pieceSize; i++) {
      piece = {};
      piece.sx = xPos;
      piece.sy = yPos;
      copyPieces.push(piece);
      xPos += pieceW;
      if (xPos >= inputW) {
        xPos = 0;
        yPos += pieceH;
      }
    }
    setPieces(shuffleArray(copyPieces));
  }, [settings]);

  useAnimationFrame(() => grabFrame());
  let one = 1;
  const grabFrame = () => {
    if (!canvasRef || !videoRef) return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !videoInput) return;
    const ctx = canvas.getContext("2d");
    const { inputW, inputH, pieceW, pieceH, puzzleW, puzzleH } = settings;
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
    if (one) {
      console.log(pieces);
    }
    one = 0;
  };

  return (
    <div className="flex justify-center items-center bg-ccc h-full w-full">
      <div className="fixed h-full w-full inset-0 overflow-hidden flex justify-center items-center">
        <SCanvas
          width={videoConstraints.width}
          height={videoConstraints.height}
          modifier={sizeModifier}
          ref={canvasRef}
          className="canvas"
        />
      </div>
      <video
        ref={videoRef}
        style={{
          transform: "scale(-1, 1)",
          position: "fixed",
          left: -10000,
        }}
      />
    </div>
  );
};

export default KolarPage;
