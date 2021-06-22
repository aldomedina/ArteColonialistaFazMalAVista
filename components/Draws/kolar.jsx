import { shuffleArray } from "../../utils";

export default (canvas, img) => {
  const { width: inputW, height: inputH } = canvas;
  const ctx = canvas.getContext("2d");

  // create pieces
  const pieceSize = 10;
  const pieceW = inputW / pieceSize;
  const pieceH = inputH / pieceSize;
  const puzzleW = pieceW * pieceSize;
  const puzzleH = pieceH * pieceSize;

  let pieces = [];
  let piece,
    xPos = 0,
    yPos = 0;

  for (let i = 0; i < pieceSize * pieceSize; i++) {
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

  // shuffle pieces
  pieces = shuffleArray(pieces);
  ctx.clearRect(0, 0, puzzleW, puzzleH);
  xPos = 0;
  yPos = 0;
  piece = {};

  for (let i = 0; i < pieces.length; i++) {
    piece = pieces[i];
    piece.xPos = xPos;
    piece.yPos = yPos;
    ctx.drawImage(
      img,
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
