//import "./index.css";
import { ReactNode, useEffect, useState } from "react";
import CastumBarChart from "./components/BarChart";
import Model from "./components/Model";
import Select from "./components/Select";

import { getReportData } from "./tempApi";
import { PivotData, chartsPivot } from "./typing.d";

const formatChartsData = async (data: any, pivotData: PivotData | any) => {
  let filtedData: any = [];
  for (let i = 0; i <= data.length - 1; i++) {
    let dateString = data[i]["תאריך"];
    let thisDate = new Date(dateString).getTime();
    let endT = new Date(pivotData.endingDate).getTime();
    let startT = new Date(pivotData.startinDate).getTime();
    // console.log({ thisDate, startT, endT });
    //  console.log({ dateString });
    let currentCard = data[i]["לקוח/ספק"];
    if (
      thisDate > startT &&
      thisDate < endT &&
      currentCard > "6024" &&
      currentCard < "7000"
    ) {
      // console.log("in if statment");
      filtedData.push(data[i]);
    }
  }
  return filtedData;
};

const makeHashTable = async (
  FilterdData: any,
  keys: any,
  key: string | "פריט"
) => {
  let hashTable: { [key: string]: number } = {};
  // console.log({ FilterdData });
  for (let i = 0; i <= keys.length - 1; i++) {
    hashTable[keys[i]] = 0;
  }

  for (let i = 0; i <= FilterdData.length - 1; i++) {
    //console.log(hashTable);
    // let hashCurrentValue = hashTable[FilterdData[i][key]];
    //  let tableAddedValue = FilterdData[i]["סה&quot;כ בתנועה"];
    // let keyid = FilterdData[i][key];
    // console.log({ hashCurrentValue, tableAddedValue, keyid });
    // console.log();
    hashTable[FilterdData[i][key]] += -FilterdData[i]["סה&quot;כ בתנועה"];
  }
  //console.log(hashTable);
  // console.log({ hashTable });
  return hashTable;
};

const filterItemList = async (data: object[], key: string = "פריט") => {
  return [...new Set(data.map((row: any) => row[key]))];
};

function App() {
  const [data, setData] = useState([]);
  const [pivot, setPivot] = useState<PivotData>({
    startinDate: undefined,
    endingDate: undefined,
    pivotKey: undefined,
  });
  const [itemsNames, setItemsNames] = useState<any[]>();
  const [visible, setVisible] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<object>({});
  const [load, setLoad] = useState<boolean>(true);
  const [currentData, setCurrentData] = useState<any>();

  useEffect(() => {
    getReportData()
      .then((res) => {
        //  console.log({ res });
        setData(res.status.repdata);
      })
      .then(() => {
        // console.log({ data });
      });

    return console.log("clean up");
  }, []);

  const updateTable = async () => {
    if (checkPivotData()) {
      console.log("data ok in select");
      let filterdData = await formatChartsData(data, pivot);
      //  console.log({ filterdData });
      let filterdItems = await filterItemList(filterdData, pivot.pivotKey);
      setCurrentData(filterdData);
      setItemsNames(() => filterdItems);
      /*@ts-ignore */
      let HashTable = await makeHashTable(
        filterdData,
        itemsNames,
        pivot.pivotKey ? pivot.pivotKey : "פריט"
      );
      setChartsData(HashTable);
    }
    // console.log("chart data ", chartsData);
    return false;
  };
  const checkPivotData = () => {
    let isOk = true;
    Object.values(pivot).find((value) => {
      if (value === undefined) isOk = false;
    });
    return isOk;
  };
  const handleSelect = async (e: any) => {
    console.log("data 0 exem ^^^^^^", data[0]);
    let value = e.target.value;
    let name = e.target.name;
    console.log({ value, name });
    if (name == "select") {
      console.log({ itemsNames });
      setPivot((prev) => ({ ...prev, pivotKey: chartsPivot[value] }));
    }
    console.log("select ", e.target.name);
    if (name == "end") setPivot((prev) => ({ ...prev, endingDate: value }));
    if (name == "start") setPivot((prev) => ({ ...prev, startinDate: value }));
    // console.log({ pivot });
    // await updateTable();
  };

  const handleClick = async (e: any) => {
    console.log("e taerget ", e.target);
    let isPivotDataOk = checkPivotData();
    console.log({ isPivotDataOk });
    if (e.target.name == "submit" && isPivotDataOk === false)
      setVisible((prev) => !prev);
    else {
      setLoad(true);
      setLoad(await updateTable());
      console.log({ load });

      //  let cData = await formatChartsData(data, pivot);
      //  setChartsData(cData);
      console.log("data ok++");
    }
    if (e.target?.id == "pop_up" || e.taerget?.id == "pop_up_text")
      setVisible((prev) => !prev);
  };

  return (
    <div>
      <div className="flex bg-slate-500">
        <Select handleSelect={handleSelect} setPivot={setPivot} pivot={pivot} />

        <div className="flex flex-col">
          <label>תאריך סיום</label>
          <input name="end" type="date" onChange={handleSelect} />
        </div>
        <div className="flex flex-col">
          <label>תאריך התחלה</label>
          <input name="start" type="date" onChange={handleSelect} />
        </div>
        <button
          name="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          הפק
        </button>
      </div>
      {!load ? (
        <CastumBarChart hashTable={chartsData} />
      ) : (
        <h1 className={"text-xl8 text-center"}> טוען אינעל דינק ......</h1>
      )}
      {currentData && (
        <table className="table-auto">
          <thead className="bg-white border-b">
            <tr className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              {Object.keys(currentData[0]).map((header) => (
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {header}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map(
              (row: { [s: string]: ReactNode } | ArrayLike<ReactNode>) => (
                <tr className="bg-gray-100 border-b">
                  {Object.values(row).map((cell) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              )
            )}
            <tr></tr>
          </tbody>
        </table>
      )}

      {visible && <Model handleClick={handleClick} />}
      <div></div>
    </div>
  );
}

export default App;
