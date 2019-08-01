import vsvgPaths from 'vsvg-paths';
import earcut from 'earcut';

// ПОЛУЧАЕМ КООРДИАНТЫ ТОЧЕК ТРЕУГОЛЬНИКОВ
const trianglePolygons = (arCoords) => {
  // ВЫЗЫВАЕМ ФУНКЦИЮ ТРИАНГУЛЯЦИИ
  const trianglesData = earcut.flatten([arCoords]);
  return earcut(trianglesData.vertices, trianglesData.holes, trianglesData.dimensions);
}

// ФОРМИРУЕМ МАССИВ ИЗ ОБЪЕКТОВ В МАССИВ ИЗ МАССИВОВ (для earcut)
const objectToArray = (arrayOfObject) => {
  return arrayOfObject.map(coords => {
    return coords.map(coord => {
      return [coord.x, coord.y];
    });
  });
}

// ПОЛУЧАЕМ КООРДИНАТЫ ВЕРШИН КАЖДОГО ПОЛИГОНА
const decodePaths = (arData, isAbsoluteCoord) => {
  let arAbsoluteData = arData;
  if (isAbsoluteCoord) {
    arAbsoluteData = arData.map(data => {
      return getAbsoluteCoords(vsvgPaths.decode(data.path));
    });
  }

  const arCoords = objectToArray(arAbsoluteData);

  const trian = arCoords.map(coords => {
    return trianglePolygons(coords);
  });

  console.log(arAbsoluteData);
  console.log(trian);
}

// ПРИВОДИМ КООРДИНАТЫ К АБСОЛЮТНЫМ ЗНАЧЕНИЯМ
// Некторые SVG элементы имеют для первой вершины абсолютные координаты, но относительные для остальных 
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
