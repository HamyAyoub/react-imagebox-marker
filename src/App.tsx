import React, { useState, useEffect } from "react";
import ImageMapper, { MarkInterface, StatusType } from "./ImageMapper";

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

const App: React.FC = () => {
  const [mark, setMark] = useState<MarkInterface | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [markStatus, setMarkStatus] = useState<StatusType>("new");

  useEffect(
    () => {
      const mapData = fakeData.slice();
      setList(mapData);
    },
    [
      /* mapData */
    ]
  ); // better to listen to your Server Data

  const getImageMark = (markObj: MarkInterface, onlyGet: boolean = false) => {
    setMark(markObj);
    if (markStatus === "reLocate") return;
    if (!onlyGet) setMarkStatus("edit");
  };

  const saveMark = (markObj: MarkInterface) => {
    let listData = [...list];
    const index = list.findIndex((d) => d.number === markObj.number);
    if (index < 0) {
      // send Post to Server EndMark
      // ...
      listData = [...listData, markObj];
    } else {
      // send Put to Server EndMark
      // ...
      listData[index] = markObj;
    }
    setList(listData);
    setMarkStatus("new");
    setMark(null);
  };

  const removeCb = (markObj: MarkInterface) => {
    if (markStatus === "locked") return;
    const obj = list.find((data) => markObj.number === data.number);
    if (obj) {
      // send Delete to Server EndMark
      // ...
      const filteredData = list.filter((d) => d.number !== obj.number);
      setList(filteredData);
    }
    setMark(null);
  };

  const cancelunSavedMark = (markObj: MarkInterface) => {
    setMark(null);
    const obj = list.find((data) => markObj.number === data.number);
    if (obj) return;
    setList([...list]);
    setMarkStatus("new");
  };

  const reLocate = () => {
    setMarkStatus("reLocate");
  };

  const toggleLockImage = (markObj: MarkInterface) => {
    if (markStatus === "locked") setMarkStatus("new");
    else {
      if (!markObj || list.find((data) => markObj.number === data.number)) {
        setMarkStatus("locked");
      }
    }
  };

  return (
    <>
      <button onClick={() => toggleLockImage(mark)}>
        {markStatus === "locked" ? "Unlock" : "Lock"}
      </button>
      &nbsp;
      {mark && (
        <>
          <button onClick={() => saveMark(mark)}>Save</button>
          &nbsp;
          <button onClick={() => cancelunSavedMark(mark)}>Cancel</button>
          &nbsp;
        </>
      )}
      {markStatus !== "locked" &&
        mark &&
        list.find((d) => d.number === mark.number) && (
          <>
            {markStatus !== "reLocate" && (
              <>
                <button onClick={() => reLocate()}>ReMark</button>
                &nbsp;
              </>
            )}
            <button onClick={() => removeCb(mark)}>
              Remove ({mark.number})
            </button>
          </>
        )}
      <hr />
      <ImageMapper
        relocatingMark={markStatus === "reLocate" ? mark : undefined}
        x_AxisAttribute="x"
        y_AxisAttribute="y"
        idAttribute="number"
        labelAttribute="number"
        status={markStatus}
        dataSource={list}
        getMark={getImageMark}
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
        // bufferPoisition={12.5} // width/2
        imageSource="https://images.amcnetworks.com/amc.com/wp-content/uploads/2015/04/cast_bb_700x1000_walter-white-lg.jpg"
        // imageSource="https://via.placeholder.com/600/92c952"
      />
    </>
  );
};

export default App;
