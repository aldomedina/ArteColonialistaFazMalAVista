import { useEffect, useRef, useState, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import styled from "styled-components";
import Webcam from "react-webcam";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
import Prints from "../components/Prints";
import { createFloydSteinbergCanvas } from "../components/Draws/FloydSteinberg";

const SCanvas = styled.canvas`
  transform: ${({ modifier }) => `scale(${modifier})`};
`;

const EurocentrismPage = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({});
  const [sizeModifier, setSizeModifier] = useState(1);
  const [detections, setDetections] = useState([]);
  const [prints, setPrints] = useState([]);
  const todaysDate = new Date();

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
        setVideoConstraints({ height, width, aspectRatio });
        runCoco();
      });
  }, []);

  useEffect(() => {
    const { width: inputW, height: inputH } = canvasRef.current;

    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      const { height, width, aspectRatio } = videoConstraints;
      setSizeModifier({
        width: innerWidth / width,
        height: innerHeight / height,
      });
    }
  }, [videoConstraints]);

  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 1500);
  };

  const detect = async (net) => {
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      const predictions = await net.detect(videoRef.current);
      setDetections(predictions);
    }
  };

  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!canvasRef || !videoRef) return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !videoInput) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.drawImage(videoInput, 0, 0);
    const pixelatedCanvas = createFloydSteinbergCanvas(canvas, 10);
    ctx.fillStyle = "#CCC";
    ctx.fillRect(0, 0, width, height);
    // intervention settings
    let gap = 10;
    let maxLines = 10;
    let FIX_HEIGHT = (height - gap * (maxLines + 1)) / maxLines;

    // draw
    let currentLines = 0;
    detections &&
      !!detections.length &&
      detections.forEach((el, i) => {
        const tag = el.class === "person" ? "Savage" : "Loot";
        const text = "subject " + (i + 1) + ". " + tag;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.font = "18px Arial";
        ctx.fillText(text, el.bbox[2] / 2, 20);
        ctx.drawImage(
          pixelatedCanvas,
          el.bbox[0],
          el.bbox[1],
          el.bbox[2],
          el.bbox[3],
          el.bbox[0],
          el.bbox[1],
          el.bbox[2],
          el.bbox[3]
        );
      });
  };

  // Prints
  useMemo(() => {
    if (detections.length) {
      const printsCopy = [...prints];
      detections.map((det) => {
        printsCopy.length + 1 > 10 && printsCopy.pop();
        printsCopy.push({
          date: new Date(),
          score: det.score,
          class: det.class,
        });
      });
      setPrints(printsCopy);
    }
  }, [detections]);

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
      <div className="w-full text-white fixed top-0 left-0 text-lg z-30">
        <h1>A ARTE COLONIALISTA FAZ MAL A VISTA</h1>
      </div>
      <div className="fixed left-0 top-0 w-full h-full flex items-end  py-1 ">
        <Prints data={prints} />
      </div>
    </div>
  );
};

export default EurocentrismPage;
