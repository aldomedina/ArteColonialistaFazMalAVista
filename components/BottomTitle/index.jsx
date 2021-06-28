import React from "react";

const BottomTitle = ({ bg }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 px-05 py-05 w-full text-lg ${
        bg ? "bg-white" : "text-white"
      }`}
    >
      <h1 className="uppercase pixelate">
        A Arte Fascista <br />
        faz mal à vista
      </h1>
    </div>
  );
};

export default BottomTitle;
