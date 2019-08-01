import decodeData from './decode';

const getArRegex = (regex, str) => {
  let result = [];

  let m = null;

  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match) => {
      result.push(match);
    });
  }

  return result;
}

const getStyleColors = (svgElem) => {
  const styleElem = svgElem.getElementsByTagName('style');

  const classes = getArRegex(/(fil\d+)/gm, styleElem[0].textContent);
  const colors = getArRegex(/(#\w+)/gm, styleElem[0].textContent);

  return {
    classes,
    colors
  };
}

const parserSvgPath = (svgElem, isAbsoluteCoord) => {
  const arPathTag = svgElem.getElementsByTagName('path');

  const arData = [...arPathTag].map(path => {
    return {
      path: path.getAttribute('d'),
      color: path.getAttribute('fill'),
      class: path.getAttribute('class'),
    };
  });

  const classEvery = arData.every(i => i.class);
  const colorEvery = arData.every(i => i.color);

  if (classEvery && !colorEvery) {
    const arFill = getStyleColors(svgElem);
    arData.map(data => {
      let currentColor = null;
      arFill.classes.forEach((classFill, classIndex) => {
        if(data.class === classFill) {
          currentColor = arFill.colors[classIndex];
        }
      });
      data.color = currentColor;
      return data;
    })
  }

  decodeData(arData, isAbsoluteCoord);
}

export default parserSvgPath;
