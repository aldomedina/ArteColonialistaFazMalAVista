import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
import useWindowsSize from "../components/Hooks/useWindowsSize";

function Eurocentrism() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [sizeModifier, setSizeModifier] = useState(1);
  const { width, height } = useWindowsSize();

  useEffect(() => {
    runCoco();
  }, []);

  useEffect(() => {
    if (webcamRef?.current?.video) resizeCanvas();
  }, [width, height, webcamRef]);

  const resizeCanvas = (a) => {
    console.log("argument", a);
    const { videoWidth, videoHeight } = webcamRef.current.video;
    if (videoWidth && videoHeight) {
      const aspectRatio = videoWidth / videoHeight;
      const multiplicador =
        aspectRatio > 1 ? width / videoWidth : height / videoHeight;
      setSizeModifier(multiplicador);
    }
  };

  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;

      // Make Detections
      const predictions = await net.detect(video);
      setDetections(predictions);
    }
  };

  useEffect(() => {
    console.log(detections);
  }, [detections]);

  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!canvasRef || !webcamRef) return;
    const videoInput = webcamRef.current.video;
    const canvas = canvasRef.current;
    if (!canvas || !videoInput) return;

    // Set canvas height and width
    const { videoWidth, videoHeight } = videoInput;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoInput, 0, 0);

    detections &&
      !!detections.length &&
      detections.forEach((prediction) => {
        // Extract boxes and classes
        const [x, y, width, height] = prediction["bbox"];
        const text = prediction["class"];

        // Set styling
        const color = Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = "#" + color;
        ctx.font = "18px Arial";

        // Draw rectangles and text
        ctx.beginPath();
        ctx.fillStyle = "#" + color;
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
      });
  };

  return (
    <div className="w-full h-full">
      <Webcam
        audio={false}
        onUserMedia={resizeCanvas}
        ref={webcamRef}
        videoConstraints={{ facingMode: "environment" }}
        forceScreenshotSourceSize="true"
        style={{
          position: "fixed",
          right: 0,
          opacity: 0,
        }}
      />
      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{ transform: `scale(${sizeModifier})` }}
        />
      </div>
    </div>
  );
}

export default Eurocentrism;
