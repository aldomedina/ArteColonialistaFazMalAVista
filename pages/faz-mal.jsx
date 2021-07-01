import { useRef, useState, useEffect } from "react";
import Layout from "../components/Layout";
import Burguer from "../components/Burguer";
import useWindowSize from "../components/Hooks/useWindowsSize";
import VideoKolarCanvas from "../components/VideoKolarCanvas";

const FazMal = () => {
  const videoRef = useRef();
  const { width, height } = useWindowSize();
  const [videoLoaded, setVideoLoaded] = useState(false);

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
        setVideoLoaded(true);
      });
  }, []);

  return (
    <Layout>
      <div className="faz-mal h-full relative" style={{ minWidth: width }}>
        <div className="absolute left-0 top-0 bg-white p-5px">
          <Burguer />
        </div>
        <div className="h-full w-full p-5px overflow-y-auto">
          {videoLoaded && (
            <VideoKolarCanvas
              videoRef={videoRef}
              screenW={width}
              screenH={height}
            />
          )}
          <div className="h-full" />
          <div className="content bg-white">
            <h1 className="big-title">A ARTE COLONIALISTA FAZ MAL À VISTA</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex quam
              ab, dolores voluptas repudiandae ea consectetur aspernatur odio
              ipsum possimus impedit consequatur sunt vitae alias deserunt
              tenetur. Vero, ad harum.
            </p>
          </div>
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
