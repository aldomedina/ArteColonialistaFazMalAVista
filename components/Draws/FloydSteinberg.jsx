export const createFloydSteinbergCanvas = (inputCanvas, errorMultiplier) => {
  const inputCtx = inputCanvas.getContext("2d");
  const { width: inputW, height: inputH } = inputCanvas;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");

  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  //   let pa = imgData.data;
  //   pa = FloydSteinbergDithering(errorMultiplier, pa, inputW, inputH);
  //   const arrToUint8 = new Uint8ClampedArray(pa);
  //   const imageData = new ImageData(arrToUint8, inputW, inputH);
  //   outputCtx.putImageData(imageData, 0, 0);
  let newImageData = monochrome(imgData, 120, "bayer");
  outputCtx.putImageData(newImageData, 0, 0);
  return outputCanvas;
};

export function FloydSteinbergDithering(errorMultiplier, data, w, h) {
  var filter = [
    [0, 0, 0, 7 / 48, 5 / 48],
    [3 / 48, 5 / 48, 7 / 48, 5 / 48, 3 / 48],
    [1 / 48, 3 / 48, 5 / 48, 3 / 48, 1 / 48],
  ];
  var error = [];
  var x, y, xx, yy, r, g, b;
  for (y = 0; y < h; y++) error.push(new Float32Array(w));
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      var id = (y * w + x) * 4;
      r = data[id];
      g = data[id + 1];
      b = data[id + 2];

      var avg = (r + g + b) / 3;
      avg -= error[y][x] * errorMultiplier;

      var e = 0;
      if (avg < 128) {
        e = -avg;
        avg = 0;
      } else {
        e = 255 - avg;
        avg = 255;
      }

      data[id] = data[id + 1] = data[id + 2] = avg;
      data[id + 3] = 255;

      for (yy = 0; yy < 3; yy++) {
        for (xx = -2; xx <= 2; xx++) {
          if (y + yy < 0 || h <= y + yy || x + xx < 0 || w <= x + xx) continue;
          error[y + yy][x + xx] += e * filter[yy][xx + 2];
        }
      }
    }
  }
  return data;
}

function monochrome(imageData, threshold, type) {
  var bayerThresholdMap = [
    [15, 135, 45, 165],
    [195, 75, 225, 105],
    [60, 180, 30, 150],
    [240, 120, 210, 90],
  ];

  var lumR = [];
  var lumG = [];
  var lumB = [];
  for (var i = 0; i < 256; i++) {
    lumR[i] = i * 0.399;
    lumG[i] = i * 0.687;
    lumB[i] = i * 0.114;
  }

  var imageDataLength = imageData.data.length;

  // Greyscale luminance (sets r pixels to luminance of rgb)
  for (var i = 0; i <= imageDataLength; i += 4) {
    imageData.data[i] = Math.floor(
      lumR[imageData.data[i]] +
        lumG[imageData.data[i + 1]] +
        lumB[imageData.data[i + 2]]
    );
  }

  var w = imageData.width;
  var newPixel, err;

  for (
    var currentPixel = 0;
    currentPixel <= imageDataLength;
    currentPixel += 4
  ) {
    if (type === "none") {
      // No dithering
      imageData.data[currentPixel] =
        imageData.data[currentPixel] < threshold ? 0 : 255;
    } else if (type === "bayer") {
      // 4x4 Bayer ordered dithering algorithm
      var x = (currentPixel / 4) % w;
      var y = Math.floor(currentPixel / 4 / w);
      var map = Math.floor(
        (imageData.data[currentPixel] + bayerThresholdMap[x % 4][y % 4]) / 2
      );
      imageData.data[currentPixel] = map < threshold ? 0 : 255;
    } else if (type === "floydsteinberg") {
      // Floyd–Steinberg dithering algorithm
      newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
      err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
      imageData.data[currentPixel] = newPixel;

      imageData.data[currentPixel + 4] += err * 7;
      imageData.data[currentPixel + 4 * w - 4] += err * 3;
      imageData.data[currentPixel + 4 * w] += err * 5;
      imageData.data[currentPixel + 4 * w + 4] += err * 1;
    } else {
      // Bill Atkinson's dithering algorithm
      newPixel = imageData.data[currentPixel] < threshold ? 0 : 255;
      err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
      imageData.data[currentPixel] = newPixel;

      imageData.data[currentPixel + 4] += err;
      imageData.data[currentPixel + 8] += err;
      imageData.data[currentPixel + 4 * w - 4] += err;
      imageData.data[currentPixel + 4 * w] += err;
      imageData.data[currentPixel + 4 * w + 4] += err;
      imageData.data[currentPixel + 8 * w] += err;
    }

    // Set g and b pixels equal to r
    imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] =
      imageData.data[currentPixel];
  }

  return imageData;
}
