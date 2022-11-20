import { useEffect, useState } from "react";
import CastumBarChart from "./components/BarChart";
import Model from "./components/Model";
import Select from "./components/Select";
import { getReportData } from "./tempApi";
import { PivotData, chartsPivot } from "./typing.d";

const formatChartsData = async (keys: string[], data: any, pivot: PivotData | any) => {
  let hashTable: { [key: string]: number } = {};
  let filtedData: any = [];
  for (let i = 0; i <= data.length - 1; i++) {
    if (data[i]["תאריך"] > pivot.startinDate && data[i]["תאריך"] < pivot.endingDate) filtedData.push(data[i]);
  }
  console.log({ filtedData });
  for (let i = 0; i <= keys.length - 1; i++) {
    hashTable[keys[i]] = 0;
  }

  for (let i = 0; i <= filtedData.length - 1; i++) {
    hashTable[filtedData[i][pivot.pivotKey]] =
      hashTable[filtedData[i][pivot.pivotKey]] + -filtedData[i]["סה&quot;כ בתנועה"];
  }
  console.log(hashTable);
  return hashTable;
};

function App() {
  const [data, setData] = useState([]);
  const [pivot, setPivot] = useState<PivotData>({
    startinDate: undefined,
    endingDate: undefined,
    pivotKey: undefined,
  });
  const [itemsNames, setItemsNames] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<object>({});
  useEffect(() => {
    getReportData()
      .then((res) => {
        console.log(res);
        setData(res.status.repdata);
      })
      .then(() => {
        console.log({ data });
      });

    return console.log("clean up");
  }, []);

  const checkPivotData = () => {
    let isOk = true;
    Object.values(pivot).find((value) => {
      if (value === undefined) isOk = false;
    });
    return isOk;
  };
  const handleSelect = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    console.log({ value, name });
    if (name == "select") {
      setItemsNames([...new Set(data.map((row) => row[chartsPivot[value]]))]);
      console.log({ itemsNames });
      setPivot((prev) => ({ ...prev, pivotKey: chartsPivot[value] }));
    }
    console.log("select ", e.target.name);
    if (name == "end") setPivot((prev) => ({ ...prev, endingDate: value }));
    if (name == "start") setPivot((prev) => ({ ...prev, startinDate: value }));
    console.log({ pivot });
  };

  const handleClick = async (e: any) => {
    console.log("e taerget ", e.target);
    let isPivotDataOk = checkPivotData();
    console.log({ isPivotDataOk });
    if (e.target.name == "submit" && isPivotDataOk === false) setVisible((prev) => !prev);
    else {
      let cData = await formatChartsData(itemsNames, data, pivot);
      setChartsData(cData);
    }
    if (e.target?.id == "pop_up" || e.taerget?.id == "pop_up_text") setVisible((prev) => !prev);
  };

  return (
    <div>
      <div className="flex text-3xl">
        <Select handleSelect={handleSelect} setPivot={setPivot} pivot={pivot} />
        <div className="flex flex-col">
          <label>תאריך התחלה</label>
          <input name="start" type="date" onChange={handleSelect} />
        </div>
        <div className="flex flex-col">
          <label>תאריך סיום</label>
          <input name="end" type="date" onChange={handleSelect} />
        </div>
        <button
          name="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          הפק
        </button>
      </div>
      <div className="flex bg-lime-500 text-4xl">
        <div className="flex flex-col px-7 py-5 ">
          <label>מפתח חיפוש</label>
          <p>{pivot?.pivotKey}</p>
        </div>
        <div className="flex flex-col px-7 py-5 ">
          <label>תאריך התחלה</label>
          <p>{pivot?.startinDate}</p>
        </div>
        <div className="flex flex-col px-7 py-5 ">
          <label>תאריך סיום</label>
          <p>{pivot?.endingDate}</p>
        </div>
      </div>

      <div>{itemsNames}</div>
      <CastumBarChart hashTable={chartsData} />

      {visible && <Model handleClick={handleClick} />}
    </div>
  );
}

export default App;
