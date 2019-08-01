import { decode } from 'vsvg-paths';
import earcut from 'earcut';

const decodePaths = (arData, absoluteCoord) => {
  console.log(arData);
  const arAbsoluteData = arData.map(data => {
    getAbsoluteCoords(decode(data.path), absoluteCoord);
  });
}

const getAbsoluteCoords = (coords, absoluteCoord) => {
  console.log(coords);
  console.log(absoluteCoord);
}

export default decodePaths;
