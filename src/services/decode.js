import { decode } from 'vsvg-paths';
import earcut from 'earcut';

const decodePaths = (arData, isAbsoluteCoord) => {
  let arAbsoluteData = arData;
  if (isAbsoluteCoord) {
    arAbsoluteData = arData.map(data => {
      return getAbsoluteCoords(decode(data.path));
    });
  }

  console.log(arAbsoluteData);
}

const getAbsoluteCoords = (coords) => {
  let newCoord = Object.assign([], coords);
  newCoord = newCoord.filter(i => i.x);

  const absoluteX = newCoord[0].x;
  const absoluteY = newCoord[0].y;

  return newCoord.map((coord, index) => {
    const newCoord = Object.assign({}, coord);
    if (index !== 0) {
      newCoord.x = absoluteX + newCoord.x;
      newCoord.y = absoluteY + newCoord.y;
    }
    return {
      x: newCoord.x,
      y: newCoord.y,
    };
  });
}

export default decodePaths;
