import vsvgPaths from 'vsvg-paths';
import earcut from 'earcut';

const TARGET_PERCENT = 9;

const getMedium = (x1, x2, x3) => {
  return Number((x1 + x2 + x3) / 3);
}

const getSquare = (x1, y1, x2, y2, x3, y3) => {
  var points = [(x1 - x3), (x2 - x3), (y1 - y3), (y2 - y3)];
  return Number(((points[0] * points[3]) - (points[1] * points[2])) / 2);
}

const sortFormula = (a, b) => {
  return b.square - a.square;
}

const sortBySquare = (arPointsCenters) => {
  arPointsCenters.sort((a, b) => {
    if (a && a[2] && a[2].square && b && b[2] && b[2].square) {
      return sortFormula(a[2], b[2]);
    }
  })

  return arPointsCenters;
}

//ФОРМИРУЕМ МАССИВ ИЗ КООРДИНАТ ЦЕНТРОВ КАЖДОГО ТРЕУГОЛЬНИКА
const getPointCenters = (triangles) => {
  let arPointsCenters = [];

  let a = 0, b = 1, c = 2;
  if (triangles[a] && triangles[b] && triangles[c]) {
    arPointsCenters.push({
      x: getMedium(
        triangles[a][0],
        triangles[b][0],
        triangles[c][0]
      )
    });

    arPointsCenters.push({
      y: getMedium(
        triangles[a][1],
        triangles[b][1],
        triangles[c][1]
      )
    });

    arPointsCenters.push({
      square: getSquare(
        triangles[a][0], triangles[a][1],
        triangles[b][0], triangles[b][1],
        triangles[c][0], triangles[c][1]
      )
    });
  }

  return arPointsCenters;
}

// ПОЛУЧАЕМ КООРДИАНТЫ ТОЧЕК ТРЕУГОЛЬНИКОВ
const trianglePolygons = (arCoords) => {
  // ВЫЗЫВАЕМ ФУНКЦИЮ ТРИАНГУЛЯЦИИ
  const trianglesData = earcut.flatten([arCoords]);
  const trianglesResult = earcut(trianglesData.vertices, trianglesData.holes, trianglesData.dimensions);

  const triangles = trianglesResult.map((trian, trianIndex) => {
    const index = trianglesResult[trianIndex];
    return [trianglesData.vertices[index * trianglesData.dimensions], trianglesData.vertices[index * trianglesData.dimensions + 1]];
  });

  return triangles;
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

  const arPointsCenters = trian.map(items => {
    return getPointCenters(items);
  })

  // закончил тут
  // теперь нужно получить 9% количества точек от каждого полигона
  // и затем нарисовать точки
  const arSortPointCenters = sortBySquare(arPointsCenters);

  // console.log(arAbsoluteData);
  // console.log(arPointsCenters);
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
