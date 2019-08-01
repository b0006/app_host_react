import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import parserSvgPath from '../../../../services/parser';

const FileForm = () => {
  const [absoluteCoord, setAbsoluteCoord] = useState(false);
  const [inputFile, setInputFile] = useState(null);
  const [fileImg, setFileImg] = useState(null);

  const readFile = (file) => {
    if (file.type === 'image/svg+xml') {
      setInputFile(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setFileImg(reader.result);
    }
  }

  const getSvgDocumentFile = async (file) => {
    const filePath = URL.createObjectURL(file);
    const svgDocument = await d3.xml(filePath);
    const svgElem = document.importNode(svgDocument.documentElement, true);
    parserSvgPath(svgElem, absoluteCoord);
  }

  const onFileChange = (files) => {
    readFile(files[0]);
  }

  useEffect(() => {
    if (inputFile) {
      getSvgDocumentFile(inputFile);
    }
  }, [inputFile]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <input
            type="file"
            accept="image/svg+xml"
            onChange={(e) => onFileChange(e.target.files)}
          />
        </div>
        <div>
          <label>Абсолютные координаты</label>
          <input
            type="checkbox"
            checked={absoluteCoord}
            onChange={() => setAbsoluteCoord(!absoluteCoord)}
          />
        </div>
      </div>
      <div style={{ marginTop: '50px' }}>
        {fileImg && <img src={fileImg} alt="preview" width="500px" />}
      </div>
    </div>
  )
}

export default FileForm;
