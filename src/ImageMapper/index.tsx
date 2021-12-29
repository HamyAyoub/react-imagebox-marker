import React, { useState, useEffect, useRef, MouseEvent } from "react";
import CSS from "csstype";

export interface MarkInterface {
  [key: string]: string | number;
}

export type StatusType = "new" | "edit" | "locked" | "reLocate";

type CoordinatesType = {
  height: number;
  width: number;
};

type Props = {
  x_AxisAttribute: string;
  y_AxisAttribute: string;
  idAttribute: string;
  labelAttribute: string;
  scrollable: boolean;
  imageSource: string;
  dataSource: MarkInterface[];
  status: StatusType;
  getMark: (markObj: MarkInterface, onlyGet?: boolean) => void;
  bufferPoisition?: number;
  wrapperBorder?: string;
  lasbelStyles?: CSS.Properties;
  relocatingMark?: MarkInterface;
};

const ImageMapper: React.FC<Props> = ({
  bufferPoisition,
  scrollable,
  wrapperBorder,
  lasbelStyles,
  imageSource,
  dataSource,
  x_AxisAttribute,
  y_AxisAttribute,
  idAttribute,
  labelAttribute,
  getMark,
  relocatingMark,
  status
}: Props) => {
  const [marksList, setMarksList] = useState<MarkInterface[]>([]);
  const [imgCoordinates, setImgCoordinates] = useState<CoordinatesType | null>(
    null
  );
  const imgElem = useRef<HTMLImageElement | null>(null);

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

  const addMark = (e: MouseEvent<HTMLImageElement>) => {
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
      status === "reLocate"
        ? relocatingMark[idAttribute]
        : (updatedList.length === 0
            ? 0
            : +updatedList[updatedList.length - 1][idAttribute]) + 1;
    const newMark = {
      [idAttribute]: nextId,
      [labelAttribute]: nextId,
      [x_AxisAttribute]: x - bufferPoisition,
      [y_AxisAttribute]: y - bufferPoisition
    };
    if (status === "reLocate") {
      var index = updatedList.findIndex(
        (item) => item[idAttribute] === relocatingMark[idAttribute]
      );
      if (index !== -1) updatedList.splice(index, 1);
    }
    updatedList.push(newMark);
    setMarksList(updatedList);
    getMark(newMark);
  };

  const GetStableMark = (data: MarkInterface) => {
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
            key={data[idAttribute]}
            style={{
              position: "absolute",
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50px",
              padding: "3px",
              cursor: "default",
              ...lasbelStyles,
              userSelect: "none",
              left: data[x_AxisAttribute],
              top: data[y_AxisAttribute]
            }}
            onClick={() => GetStableMark(data)}
          >
            {data[labelAttribute]}
          </div>
        ))}
      </div>
    </div>
  );
};

ImageMapper.defaultProps = {
  bufferPoisition: 5,
  scrollable: true,
  wrapperBorder: "none",
  lasbelStyles: {}
};

export default ImageMapper;
