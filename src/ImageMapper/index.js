import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ImageMapper = ({
  bufferPoisition = 5,
  scrollable = true,
  wrapperBorder = "none",
  lasbelStyles = {},
  imageSource,
  dataSource,
  getMark,
  status
}) => {
  const [marksList, setMarksList] = useState([]);
  const [imgCoordinates, setImgCoordinates] = useState(null);
  const imgElem = useRef(null);

  useEffect(() => {
    setMarksList(dataSource);
  }, [dataSource]);

  const loadImg = () => {
    if (imgElem) {
      setImgCoordinates({
        height: imgElem.current.clientHeight,
        width: imgElem.current.clientWidth
      });
    }
  };

  const addMark = (e) => {
    if (status === "locked") return;
    const offset = imgElem.current.getBoundingClientRect();
    const x = e.pageX - offset.left - window.pageXOffset;
    const y = e.pageY - offset.top - window.pageYOffset;
    // console.log(x, y);
    const updatedList = [...marksList];
    if (status === "edit") {
      updatedList.pop();
    }
    const nextId =
      (updatedList.length === 0 ? 0 : updatedList[updatedList.length - 1].id) +
      1;
    const newMark = {
      id: nextId,
      label: nextId,
      x: x - bufferPoisition,
      y: y - bufferPoisition
    };
    updatedList.push(newMark);
    setMarksList(updatedList);
    getMark(newMark);
  };

  const GetStableMark = (data) => {
    const isEquals = marksList.length === dataSource.length;
    if (isEquals) getMark(data, true);
  };

  return (
    <div
      style={
        !!scrollable
          ? { userSelect: "none", boxSizing: "border-box", overflow: "auto" }
          : { userSelect: "none" }
      }
    >
      <div
        style={{
          height: `${imgCoordinates ? imgCoordinates.height : 0}px`,
          width: `${imgCoordinates ? imgCoordinates.width : 0}px`,
          position: "relative",
          userSelect: "none",
          boxSizing: "initial",
          border: wrapperBorder
        }}
      >
        <img
          className="img-main"
          src={imageSource}
          alt="#"
          onMouseDown={(e) => addMark(e)}
          ref={imgElem}
          onLoad={loadImg}
          style={{ userSelect: "none" }}
        />
        {marksList.map((data) => (
          <div
            key={data.id}
            style={{
              position: "absolute",
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50px",
              padding: "3px",
              cursor: "default",
              ...lasbelStyles,
              userSelect: "none",
              left: data.x,
              top: data.y
            }}
            onClick={() => GetStableMark(data)}
          >
            {data.label}
          </div>
        ))}
      </div>
    </div>
  );
};

ImageMapper.propTypes = {
  scrollable: PropTypes.bool.isRequired,
  imageSource: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(function (id, label, styles) {
    this.id = id; // number
    this.label = label; // string
    this.styles = styles; // css object
  }).isRequired,
  status: PropTypes.oneOf(["new", "edit", "locked"]).isRequired,
  getMark: PropTypes.func.isRequired,
  bufferPoisition: PropTypes.number,
  wrapperBorder: PropTypes.string,
  lasbelStyles: PropTypes.object
};

export default ImageMapper;
