export const createFloydSteinbergCanvas = (inputCanvas, errorMultiplier) => {
  const inputCtx = inputCanvas.getContext("2d");
  const { width: inputW, height: inputH } = inputCanvas;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");

  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);

  let newImageData = bayerFilter(imgData, 120);
  outputCtx.putImageData(newImageData, 0, 0);
  return outputCanvas;
};

function bayerFilter(imageData, threshold) {
  var bayerThresholdMap = [
    [15, 135, 45, 165],
    [195, 75, 225, 105],
    [60, 180, 30, 150],
    [240, 120, 210, 90],
  ];
  var imageDataLength = imageData.data.length;

  var w = imageData.width;
  for (
    var currentPixel = 0;
    currentPixel <= imageDataLength;
    currentPixel += 4
  ) {
    // 4x4 Bayer ordered dithering algorithm
    var x = (currentPixel / 4) % w;
    var y = Math.floor(currentPixel / 4 / w);
    var map = Math.floor(
      (imageData.data[currentPixel] + bayerThresholdMap[x % 4][y % 4]) / 2
    );
    imageData.data[currentPixel] = map < threshold ? 0 : 255;
    imageData.data[currentPixel + 3] = map < threshold ? 250 : 0;
    // Set g and b pixels equal to r
    imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] =
      imageData.data[currentPixel];
  }

  return imageData;
}
