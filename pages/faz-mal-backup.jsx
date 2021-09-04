import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import { useSpring, animated } from "react-spring";

import Layout from "../components/Layout";
import Burguer from "../components/Burguer";
import useWindowSize from "../components/Hooks/useWindowsSize";
import VideoKolarCanvas from "../components/VideoKolarCanvas";

const FazMal = () => {
  const videoRef = useRef();
  const { width, height } = useWindowSize();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [areMonuments, setAreMonuments] = useState(false);
  const [videoConstraints, setVideoConstraints] = useState({});
  const contentBoxProps = useSpring({
    transform: `translate3d(0,${areMonuments ? "0vh" : "100vh"},0)`,
  });
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
        setVideoLoaded(true);
      });
  }, []);

  const loadModel = async () => {
    const URL = "https://teachablemachine.withgoogle.com/models/9illglVK0/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const model = await tmImage.load(modelURL, metadataURL);
    setInterval(() => detect(model), 1000);
  };

  const detect = async (model) => {
    if (!videoRef.current) return;
    const prediction = await model.predict(videoRef.current);
    if (
      prediction[0].className === "padrao" &&
      prediction[0].probability > 0.95
    ) {
      setAreMonuments(true);
      clearInterval(detect);
    }
  };

  return (
    <Layout>
      <div className="faz-mal h-full relative" style={{ minWidth: width }}>
        <div className="absolute left-0 top-0 bg-white p-5px z-10">
          <Burguer />
        </div>
        <div
          className={`h-full w-full p-5px ${
            areMonuments ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {videoLoaded && (
            <VideoKolarCanvas
              videoRef={videoRef}
              screenW={width}
              screenH={height}
              areMonuments={areMonuments}
              videoConstraints={videoConstraints}
            />
          )}
          <div className="h-full" />
          <animated.div
            style={contentBoxProps}
            className="content bg-white p-5px"
          >
            <h1 className="big-title">A ARTE COLONIALISTA FAZ MAL À VISTA</h1>
            <h2 className="monument-name uppercase mb-1">
              Padrão dos <br /> descobrimentos
            </h2>
            <div className="body">
              <p>
                <strong>
                  Ode ao colonialismo, ressaca da ditadura e fetiche dos
                  <i> influencers</i>
                </strong>
                . O Monumeno Padrão dos Descobrimentos Lorem ipsum dolor sit
                amet consectetur, adipisicing elit. Ex quam ab, dolores voluptas
                repudiandae ea consectetur aspernatur odio ipsum possimus
                impedit consequatur sunt vitae alias deserunt tenetur. Vero, ad
                harum.
              </p>
            </div>
          </animated.div>
        </div>
      </div>
      <video
        ref={videoRef}
        style={{
          transform: "scale(-1, 1)",
          position: "fixed",
          right: -10000,
        }}
      />
    </Layout>
  );
};

export default FazMal;
