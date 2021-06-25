import { useEffect, useRef, useState } from "react";
import useAnimationFrame from "../Hooks/useAnimationFrame";
import BottomTitle from "../BottomTitle";
import styled from "styled-components";
import ml5 from "ml5";

const SCanvas = styled.canvas`
  transform: ${({ modifier }) => `scale(${modifier})`};
`;
const pieceSize = 10;

const ObjectDetector = () => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({});
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
        detectObjects();
      });
  }, []);

  const detectObjects = () => {
    const detector = ml5.objectDetector("cocossd", {}, modelLoaded);
    detector.detect(videoRef.current, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
    });
  };
  const modelLoaded = () => {
    console.log("model loaded");
  };

  return (
    <div className="flex justify-center items-center bg-ccc h-full w-full">
      <video
        ref={videoRef}
        style={{
          transform: "scale(-1, 1)",
          position: "fixed",
          left: -10000,
        }}
      />
      <BottomTitle bg />
    </div>
  );
};

export default ObjectDetector;
