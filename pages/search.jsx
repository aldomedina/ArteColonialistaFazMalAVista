import { useRef, useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { SectionContext } from "./_app";
import Layout from "../components/Layout";
import Burguer from "../components/Burguer";
import useWindowSize from "../components/Hooks/useWindowsSize";
import useAnimationFrame from "../components/Hooks/useAnimationFrame";

const SCanvas = styled.canvas`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform: ${({ modifier }) =>
    `scale(${modifier.aspectRatio > 1 ? modifier.width : modifier.height})`};
`;

const ScanningWrapper = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  display: flex;
  flex-direction: column;
  justify-content: ${({ monument }) =>
    monument ? "space-between" : "flex-end"};
  background-color: ${({ monument }) =>
    monument ? "rgba(0, 255, 0, 1)" : "rgba(0, 0, 0, 0.5)"};
  color: white;
  .moving-line {
    ${({ monument }) => !!monument && "display:none"};
  }
`;

const SearchPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [sizeModifier, setSizeModifier] = useState(1);
  const { setMonument, monument } = useContext(SectionContext);
  const { width, height } = useWindowSize();
  const [videoConstraints, setVideoConstraints] = useState({});
  const router = useRouter();

  useEffect(() => {
    // load model
    loadModel();
    // load webcam
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
  }, [videoConstraints]);

  const loadModel = async () => {
    const URL = "https://teachablemachine.withgoogle.com/models/9illglVK0/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const model = await tmImage.load(modelURL, metadataURL);
    setInterval(() => detect(model), 1000);
  };

  useEffect(() => {
    if (monument) setTimeout(() => router.push("/colombot"), 2000);
  }, [monument]);
  const detect = async (model) => {
    if (!videoRef.current) return;
    const prediction = await model.predict(videoRef.current);
    if (
      prediction[0].className === "padrao" &&
      prediction[0].probability > 0.95
    ) {
      // ;
      setMonument("padrao");
      clearInterval(detect);
    }
  };

  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!canvasRef || !videoRef) return;
    const videoInput = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !videoInput) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoInput, 0, 0, canvas.width, canvas.height);
  };

  return (
    <Layout>
      <div className="faz-mal h-full relative" style={{ minWidth: width }}>
        <div className="absolute left-0 top-0 bg-white p-5px z-10">
          <Burguer />
        </div>
        <div className={`relative h-full w-full p-5px overflow-hidden`}>
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
          <ScanningWrapper monument={monument}>
            {!!monument && (
              <h2 className="text-3xl ml-50px p-5px ">SUCCESS! YOU FOUND:</h2>
            )}
            {!!monument && (
              <h1 className="text-4xl text-center p-5px ">
                PADRAO DOS DESCOBRIMENTOS
              </h1>
            )}
            {!monument && (
              <div className="p-05">
                <h2 className="text-3xl">SEARCHING</h2>
                <p>FIND A MONUMENT AND WE'LL BRING THEM BACK</p>
              </div>
            )}
            {!!monument && (
              <h1 className="text-3xl p-5px ">REVIVING IN PROGRESS…</h1>
            )}
            <div className="moving-line" />
          </ScanningWrapper>
        </div>
        <video
          ref={videoRef}
          style={{
            transform: "scale(-1, 1)",
            position: "fixed",
            right: -10000,
          }}
        />
      </div>
    </Layout>
  );
};

export default SearchPage;
