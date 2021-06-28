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
