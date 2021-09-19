import { useState, useRef, useEffect, useMemo, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import styled from "styled-components";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
import { createFloydSteinbergCanvas } from "../components/Draws/FloydSteinberg";
import { getRandomInt, shuffleArray } from "../utils";

import useWindowSize from "../components/Hooks/useWindowsSize";
import Burguer from "../components/Burguer";
import Layout from "../components/Layout";
import Prints from "../components/Prints";
import { SectionContext } from "./_app";

const SCanvas = styled.canvas`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform: ${({ modifier }) =>
    `scale(${modifier.aspectRatio > 1 ? modifier.width : modifier.height})`};
`;

const descriptionsPerson = [
  "Potential Slave, maybe...",
  "Hmm... Gives me mercancy vibes",
  "Could be a good exportation",
  "Savage, but maybe with a soul",
  "Meh... Skin problems",
  "No soul, no love",
  "Looks like a good and talented servant",
  "I will call you... indian",
  "He could become Christian very easily",
];

const descriptionsThings = [
  "Shall be deliver to the King",
  "How splendid! new exotic piece for my museum",
  "LOOOOOOOT!!!!",
  "Kind of shine, might be gold? mine!",
  "From now own that's mine",
];

const Colombot = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const { width, height } = useWindowSize();
  const { activeSection } = useContext(SectionContext);
  const [videoConstraints, setVideoConstraints] = useState({});
  const [sizeModifier, setSizeModifier] = useState(1);
  const [detections, setDetections] = useState([]);
  const [prints, setPrints] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [printsId, setPrintsId] = useState(0);

  // TODO: create pieces matrix for different ratios. Current: 3x8 (= 24)
  const [baseMatrix, setBaseMatrix] = useState(
    shuffleArray([...Array(24).keys()])
  );

  useEffect(() => {
    navigator?.mediaDevices
      ?.getUserMedia({
        video: true,
        audio: false,
        video: {
          facingMode: "environment",
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        const { height, width, aspectRatio } = stream
          .getVideoTracks()[0]
          .getSettings();
        setVideoConstraints({ height, width });
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    const { height, width, aspectRatio } = videoConstraints;
    setSizeModifier({
      width: innerWidth / width,
      height: innerHeight / height,
      aspectRatio: innerWidth / innerHeight,
    });
    videoRef.current.addEventListener("loadeddata", runCoco);
    return () => videoRef.current.removeEventListener("loadeddata", runCoco);
  }, [videoConstraints]);

  const runCoco = async () => {
    const net = await cocossd.load();
    net && setIsModelLoading(false);
    setInterval(() => {
      activeSection === "main" && detect(net);
    }, 2000);
  };

  const detect = async (net) => {
    if (typeof videoRef.current === "undefined" && videoRef.current === null)
      return;
    const predictions = await net.detect(videoRef.current);
    setDetections(predictions);
  };

  // Prints
  useEffect(() => {
    let id = printsId;
    if (detections.length && activeSection === "main") {
      let printsCopy = [...prints];
      detections.map((det) => {
        if (det.score < 0.75) return;
        printsCopy.unshift({
          score: det.score,
          class: det.class,
          description:
            det.class === "person"
              ? descriptionsPerson[getRandomInt(descriptionsPerson.length)]
              : descriptionsThings[getRandomInt(descriptionsThings.length)],
          id,
        });
        id++;
      });
      setPrintsId(id);
      setPrints(printsCopy);
    }
  }, [detections]);

  // DRAW

  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!canvasRef || !videoRef || activeSection !== "main") return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !videoInput) return;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoInput, 0, 0);

    detections &&
      !!detections.length &&
      detections.forEach((prediction, i) => {
        const [x, y, w, h] = prediction["bbox"];
        const isTaller = h > w;
        const pieceW = isTaller ? w / 3 : w / 6;
        const pieceH = isTaller ? h / 8 : h / 4;
        const baseX = x;
        const baseY = y;
        // create array with pieces
        let posX = x,
          posY = y;
        const orderedPieces = [];
        for (let i = 0; i < baseMatrix.length; i++) {
          const newPiece = {
            posX,
            posY,
            pieceH,
            pieceW,
          };
          orderedPieces.push(newPiece);
          posX += pieceW;
          if (posX >= w + baseX) {
            posX = x;
            posY += pieceH;
          }
        }
        // use baseMatrix to shuffle pieces
        const shuffledPieces = [];
        baseMatrix.forEach(
          (shuffledIndex, i) =>
            (shuffledPieces[i] = orderedPieces[shuffledIndex])
        );

        // draw pieces
        let drawingPiece = {};
        posX = baseX;
        posY = baseY;
        for (let i = 0; i < shuffledPieces.length; i++) {
          drawingPiece = shuffledPieces[i];
          ctx.drawImage(
            videoInput,
            drawingPiece.posX,
            drawingPiece.posY,
            pieceW,
            pieceH,
            posX,
            posY,
            pieceW,
            pieceH
          );
          posX += pieceW;
          if (posX > w + baseX) {
            posX = x;
            posY += pieceH;
          }
        }

        // ADD TEXT
        const text =
          prediction["class"] === "person"
            ? "SAVAGE"
            : `EXOTIC ${prediction["class"].toUpperCase()}`;
        ctx.save();
        ctx.font = "35px NeueBit";
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(text, x, y);
        ctx.restore();
      });
  };

  return (
    <Layout>
      <div className="faz-mal h-full relative" style={{ minWidth: width }}>
        <div className="absolute left-0 top-0 bg-white p-5px z-10">
          <Burguer />
        </div>
        <div className={`h-full w-full p-5px overflow-hidden`}>
          <div
            className="absolute left-5 top-5 flex justify-center items-center overflow-hidden"
            style={{ height: height - 10, width: width - 10 }}
          >
            <SCanvas
              aspectRatio={videoConstraints.aspectRatio}
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
          <div className="fixed rigth-0 top-0 w-full h-full flex items-end  py-1 ">
            <Prints data={prints} />
          </div>
          {isModelLoading && (
            <div className="bg-ccc fixed left-0 top-0 w-full h-full flex items-center justify-center z-40">
              <svg
                className="loader-svg"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="45" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Colombot;
