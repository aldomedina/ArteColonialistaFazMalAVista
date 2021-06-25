import dynamic from "next/dynamic";

const ObjectDetector = dynamic(() => import("../components/ObjectDetector"), {
  ssr: false,
});

const EurocentrismPage = () => {
  return <ObjectDetector />;
};

export default EurocentrismPage;
