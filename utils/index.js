export const shuffleArray = (o) => {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
};

export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const getTime = (date) =>
  `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

export const createCanvasFromCoverImg = (img, inputW, inputH) => {
  const min_w = 300;
  const canvas = document.createElement("canvas");
  canvas.width = inputW;
  canvas.height = inputH;
  const scale_w = inputW / img.width;
  const scale_h = inputH / img.height;
  let scale = scale_w > scale_h ? scale_w : scale_h;
  if (scale * img.width < min_w) {
    scale = min_w / img.width;
  }
  // TO DO: replicate css "bg-size: cover"
  // ...
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, inputW, inputH);
  return canvas;
};
