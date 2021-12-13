import { useState, useEffect } from "react";
import ImageMapper from "./ImageMapper";

const fakeData = [
  {
    _id: 500,
    number: 1,
    x: 100,
    y: 100
  },
  {
    _id: 501,
    number: 2,
    x: 300,
    y: 300
  }
];

export default function App() {
  const [point, setPoint] = useState(null);
  const [list, setList] = useState([]);
  const [mapperState, setMapperState] = useState("new");

  useEffect(
    () => {
      const mapData = fakeData.map((d) => {
        return {
          id: d.number,
          label: d.number,
          x: d.x,
          y: d.y
        };
      });
      setList(mapData);
    },
    [
      /* mapData */
    ]
  ); // better to listen to your Server Data

  const getImagePoint = (pointObj, onlyGet = false) => {
    setPoint(pointObj);
    if (!onlyGet) setMapperState("edit");
  };

  const savePoint = (pointObj) => {
    let listData = [...list];
    const index = list.findIndex((d) => d.id === pointObj.id);
    if (index < 0) {
      // send Post to Server EndPoint
      // ...
      listData = [...listData, pointObj];
    } else {
      // send Put to Server EndPoint
      // ...
      listData[index] = pointObj;
    }
    setList(listData);
    setMapperState("new");
    setPoint(null);
  };

  const removeCb = (pointObj) => {
    const obj = list.find((data) => pointObj.id === data.id);
    if (obj) {
      // send Delete to Server EndPoint
      // ...
      const filteredData = list.filter((d) => d.id !== obj.id);
      setList(filteredData);
    }
    setPoint(null);
  };

  const cancelunSavedPoint = (pointObj) => {
    setPoint(null);
    const obj = list.find((data) => pointObj.id === data.id);
    if (obj) return;
    setList([...list]);
    setMapperState("new");
  };

  const toggleLockImage = (pointObj) => {
    if (mapperState === "locked") setMapperState("new");
    else {
      if (!pointObj || list.find((data) => pointObj.id === data.id)) {
        setMapperState("locked");
      }
    }
  };

  return (
    <>
      <button onClick={() => toggleLockImage(point)}>
        {mapperState === "locked" ? "Unlock" : "lock"}
      </button>
      &nbsp;
      {point && (
        <>
          <button onClick={() => savePoint(point)}>Save</button>
          &nbsp;
          <button onClick={() => cancelunSavedPoint(point)}>Cancel</button>
          &nbsp;
        </>
      )}
      {point && list.find((d) => d.id === point.id) && (
        <button onClick={() => removeCb(point)}>rm {point.id}</button>
      )}
      <hr />
      <ImageMapper
        status={mapperState}
        dataSource={list}
        getPoint={getImagePoint}
        scrollable
        wrapperBorder="thick solid purple"
        lasbelStyles={{
          cursor: "pointer",
          textAlign: "center",
          verticalAlign: "middle",
          // width: "25px",
          // height: "25px",
          // lineHeight: "25px",
          backgroundColor: "#955",
          color: "#fff"
        }}
        // positionCalculation={12.5} // width/2
        imageSource="https://images.amcnetworks.com/amc.com/wp-content/uploads/2015/04/cast_bb_700x1000_walter-white-lg.jpg"
        // imageSource="https://via.placeholder.com/600/92c952"
      />
    </>
  );
}
