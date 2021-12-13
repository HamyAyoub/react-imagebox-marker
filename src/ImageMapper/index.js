import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ImageMapper = ({
  positionCalculation = 5,
  scrollable = true,
  wrapperBorder = "none",
  lasbelStyles = {},
  imageSource,
  dataSource,
  getPoint,
  status
}) => {
  const [pointsList, setpointsList] = useState([]);
  const [imgCoordinates, setImgCoordinates] = useState(null);
  const imgElem = useRef(null);

  useEffect(() => {
    setpointsList(dataSource);
  }, [dataSource]);

  const loadImg = () => {
    if (imgElem) {
      setImgCoordinates({
        height: imgElem.current.clientHeight,
        width: imgElem.current.clientWidth
      });
    }
  };

  const addMapper = (e) => {
    if (status === "locked") return;
    const offset = imgElem.current.getBoundingClientRect();
    const x = e.pageX - offset.left - window.pageXOffset;
    const y = e.pageY - offset.top - window.pageYOffset;
    // console.log(x, y);
    const updatedList = [...pointsList];
    if (status === "edit") {
      updatedList.pop();
    }
    const nextId =
      (updatedList.length === 0 ? 0 : updatedList[updatedList.length - 1].id) +
      1;
    const newPoint = {
      id: nextId,
      label: nextId,
      x: x - positionCalculation,
      y: y - positionCalculation
    };
    updatedList.push(newPoint);
    setpointsList(updatedList);
    getPoint(newPoint);
  };

  const givePoint = (data) => {
    const isEquals = pointsList.length === dataSource.length;
    if (isEquals) getPoint(data, true);
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
          onMouseDown={(e) => addMapper(e)}
          ref={imgElem}
          onLoad={loadImg}
          style={{ userSelect: "none" }}
        />
        {pointsList.map((data) => (
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
            onClick={() => givePoint(data)}
          >
            {data.label}
          </div>
        ))}
      </div>
    </div>
  );
};

function Point(id, label, styles) {
  this.id = id; // number
  this.label = label; // string
  this.styles = styles; // css object
}

ImageMapper.propTypes = {
  scrollable: PropTypes.bool.isRequired,
  imageSource: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(Point).isRequired,
  status: PropTypes.string.isRequired,
  getPoint: PropTypes.func.isRequired,
  pointMinusPoisition: PropTypes.number,
  wrapperBorder: PropTypes.string,
  lasbelStyles: PropTypes.object
};

export default ImageMapper;
