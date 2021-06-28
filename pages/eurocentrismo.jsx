import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import styled from "styled-components";
import Webcam from "react-webcam";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
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
      aspectRatio > 1
        ? setSizeModifier(innerWidth / width)
        : setSizeModifier(innerHeight / height);
    }
  }, [videoConstraints]);

  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 300);
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
    ctx.drawImage(pixelatedCanvas, 0, 0, width, height);
    detections &&
      !!detections.length &&
      detections.forEach((prediction) => {
        // Extract boxes and classes
        const [x, y, width, height] = prediction["bbox"];
        const text = prediction["class"];

        // Set styling
        const color = "green";
        ctx.strokeStyle = color;
        ctx.font = "18px Mondwest";

        // Draw rectangles and text
        ctx.beginPath();
        ctx.fillStyle = "#" + color;
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
      });
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

export default EurocentrismPage;
