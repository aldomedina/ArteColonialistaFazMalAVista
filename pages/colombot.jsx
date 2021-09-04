import { useState, useRef, useEffect, useMemo, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import styled from "styled-components";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";
import { createFloydSteinbergCanvas } from "../components/Draws/FloydSteinberg";

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
    }, 1500);
  };

  const detect = async (net) => {
    if (typeof videoRef.current === "undefined" && videoRef.current === null)
      return;
    const predictions = await net.detect(videoRef.current);
    setDetections(predictions);
  };

  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!canvasRef || !videoRef || activeSection !== "main") return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !videoInput) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.drawImage(videoInput, 0, 0);
    const color = {
      r: 108,
      g: 245,
      b: 189,
    };
    const pixelatedCanvas = createFloydSteinbergCanvas(canvas, color);

    // draw
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    detections &&
      !!detections.length &&
      detections.forEach((prediction, i) => {
        const [x, y, w, h] = prediction["bbox"];
        const text =
          prediction["class"] === "person"
            ? "savage"
            : `exotic ${prediction["class"]}`;
        ctx.font = "18px";
        ctx.fillText(text, x, y);
        ctx.drawImage(
          pixelatedCanvas,
          x, // x
          y, // y
          w, // width
          h, // height
          x, // x
          y, // y
          w, // width
          h // height
        );
      });
  };

  // Prints
  useMemo(() => {
    if (detections.length && activeSection === "main") {
      const printsCopy = [...prints];
      detections.map((det) => {
        if (det.score < 0.75) return;
        printsCopy.length + 1 > 10 && printsCopy.shift();
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
