import React from "react";

const BottomTitle = ({ bg }) => {
  return (
    <div
      className={`fixed top-0 left-0 px-05 py-05 w-full text-lg text-center ${
        bg ? "bg-white" : "text-white"
      }`}
    >
      <h1 className="uppercase pixelate">
        A Arte <br /> Colonialista
        <br />
        faz mal à vista
      </h1>
    </div>
  );
};

export default BottomTitle;
