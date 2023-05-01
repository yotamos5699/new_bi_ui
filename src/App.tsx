//import "./index.css";
import { ReactNode, useEffect, useState } from "react";
import CastumBarChart from "./components/BarChart";
import Model from "./components/Model";
import Select from "./components/Select";

import { getSellsData, getSpacielCastumers, getTaxesData } from "./tempApi";
import { PivotData, chartsPivot } from "./typing.d";
import { useQueries, useQuery } from "@tanstack/react-query";
import PieChart_ from "./components/PieChart";

const castuner_agent = [
  { castumer: "6313", agent: 1 },
  { castumer: "6314", agent: 1 },
  { castumer: "6315", agent: 1 },
  { castumer: "6316", agent: 1 },
  { castumer: "6234", agent: 2 },
  { castumer: "6238", agent: 2 },
  { castumer: "6253", agent: 2 },
  { castumer: "6256", agent: 2 },
  { castumer: "6258", agent: 2 },
  { castumer: "6293", agent: 2 },
  { castumer: "6312", agent: 2 },
  { castumer: "6323", agent: 2 },
  { castumer: "6325", agent: 2 },
  { castumer: "6326", agent: 2 },
  { castumer: "6328", agent: 2 },
  { castumer: "6329", agent: 2 },
];

const formatChartsData = async (data: any, pivotData: PivotData | any) => {
  let filtedData: any = [];
  for (let i = 0; i <= data.length - 1; i++) {
    let dateString = data[i]["תאריך"];
    let thisDate = new Date(dateString).getTime();
    let END_TIME = new Date(pivotData.endingDate).getTime();
    let START_TIME = new Date(pivotData.startinDate).getTime();
    let currentCard = data[i]["לקוח/ספק"];
    if (thisDate >= START_TIME && thisDate <= END_TIME && currentCard > "6024" && currentCard < "7000") {
      filtedData.push(data[i]);
    }
  }

  //TEMP

  if (pivotData?.pivotKey == "סוכן") {
    let tempData = [];
    for (let i = 0; i <= filtedData.length - 1; i++) {
      let didFind = false;
      for (let j = 0; j <= castuner_agent.length - 1; j++) {
        if (filtedData[i]["לקוח/ספק"] == castuner_agent[j].castumer) {
          tempData.push({ ...filtedData[i], סוכן: castuner_agent[j].agent });
          didFind = true;
        }
      }
      if (!didFind && filtedData[i]["סוכן"] != 0) tempData.push(filtedData[i]);
    }

    return tempData;
  }

  /* the reaL DEAL !!!!!!!!!!!!!!!!!*/
  // let AgentData = [];
  // if (pivotData?.pivotKey == "סוכן") {
  //   AgentData = filtedData.filter((row: any) => row["סוכן"] != 0);
  //   return AgentData;
  // }
  // console.log({ AgentData });
  return filtedData;
};

const makeHashTable = async (FilterdData: any, keys: any, key: string | "פריט") => {
  let hashTable: { [key: string]: number } = {};

  for (let i = 0; i <= keys.length - 1; i++) {
    hashTable[keys[i]] = 0;
  }

  let sortKey = key == "סוכן" ? "כמות מקורית" : "סה&quot;כ בתנועה";
  for (let i = 0; i <= FilterdData.length - 1; i++) {
    hashTable[FilterdData[i][key]] += -FilterdData[i][sortKey];
  }

  return hashTable;
};

const filterItemList = async (data: object[], key: string = "פריט") => {
  return [...new Set(data.map((row: any) => row[key]))];
};

function App() {
  const [sellsData, setSellsData] = useState<any[]>([]);
  const [selectedGraph, setSelectedGraph] = useState({ bar: false, pie: false });
  const [checked, setChecked] = useState({ pro: false, regular: false, all: false });
  const [currentKey, setCurrentKey] = useState<null | string>(null);
  const [taxesData, setTaxesData] = useState<any[]>([]);
  const [spacielCastumers, setSpacielCastumers] = useState<any[]>([]);
  const [pivot, setPivot] = useState<PivotData>({
    startinDate: undefined,
    endingDate: undefined,
    pivotKey: undefined,
  });
  const [itemsNames, setItemsNames] = useState<any[]>();
  const [myError, setError] = useState({ show: false, message: "" });
  const [visible, setVisible] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<object>({});
  const [load, setLoad] = useState<boolean>(true);
  const [currentData, setCurrentData] = useState<any>();

  useGetQueryData(setSellsData, setTaxesData, setSpacielCastumers);

  const updateTable = async (data: any[], pivot: any) => {
    let fData;
    console.log({ data, pivot });
    if (checkPivotData()) {
      console.log("data ok in select");
      let filterdData = await formatChartsData(data, pivot);
      console.log({ filterdData });
      let filterdItems = await filterItemList(filterdData, pivot.pivotKey);
      setItemsNames([...filterdItems]);
      // setCurrentData(filterdData);
      fData = filterdData;
      /*@ts-ignore */
      let HashTable = await makeHashTable(filterdData, filterdItems, pivot.pivotKey ? pivot.pivotKey : "פריט");
      setChartsData(HashTable);
    }
    // console.log("chart data ", chartsData);
    return { isLoading: false, data: fData };
  };
  const checkPivotData = () => {
    let isOk = true;
    Object.values(pivot).find((value) => {
      if (value === undefined) isOk = false;
    });
    return isOk;
  };
  const handleSelect = async (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name == "select") {
      setPivot((prev) => ({ ...prev, pivotKey: chartsPivot[value] }));
    }

    if (name == "end") setPivot((prev) => ({ ...prev, endingDate: value }));
    if (name == "start") setPivot((prev) => ({ ...prev, startinDate: value }));
    // console.log({ pivot });
    // await updateTable();
  };

  useEffect(() => {
    console.log({ checked });
  }, [checked]);
  const handleClick = async (e: any) => {
    let isPivotDataOk = checkPivotData();

    if (e.target.name == "submit" && isPivotDataOk === false) setVisible((prev) => !prev);
    else if (e.target.name == "submit") {
      setLoad(true);
      const checkedData = await filterRelevantCastumers(sellsData, spacielCastumers, currentKey);
      if ((currentKey && !checkedData) || checkedData?.length == 0) {
        setError({ show: true, message: " מחזיר מידע מלא ,אין שורות להציג" });
        setVisible((prev) => !prev);
      }
      const { isLoading, data } = await updateTable(sellsData, pivot);
      setLoad(isLoading);
    }
    if (e.target?.id == "pop_up" || e.taerget?.id == "pop_up_text") {
      setVisible((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-800 gap-2">
      <div className="flex flex-row-reverse bg-slate-800 gap-4 justify-center">
        <Select handleSelect={handleSelect} setPivot={setPivot} pivot={pivot} />

        <div className="flex flex-col">
          <label className="flex text-white justify-center mb-1">תאריך התחלה</label>
          <input name="start" type="date" onChange={handleSelect} />
        </div>
        <div className="flex flex-col">
          <label className="flex text-white justify-center mb-1">תאריך סיום</label>
          <input name="end" type="date" onChange={handleSelect} />
        </div>
        <button
          name="submit"
          className="bg-gray-600 h-full justify-center mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          הפק
        </button>
      </div>
      <div className="flex flex-row-reverse justify-center gap-4">
        <div className="flex flex-col border-2 border-gray-400 px-2">
          <label className="text-white">שקיבלו הזמנות</label>
          <input
            checked={checked.all}
            name="all"
            type="checkbox"
            onChange={(e) => handleChecked(e.target.name, setChecked, checked, setCurrentKey)}
          />
        </div>
        <div className="flex flex-col border-2 border-gray-400 px-2">
          <label className="text-white">סיטונאים</label>
          <input
            checked={checked.pro}
            name="pro"
            type="checkbox"
            onChange={(e) => handleChecked(e.target.name, setChecked, checked, setCurrentKey)}
          />
        </div>
        <div className="flex flex-col border-2 border-gray-400 px-2">
          <label className="text-white">כלליים</label>
          <input
            checked={checked.regular}
            name="regular"
            type="checkbox"
            onChange={(e) => handleChecked(e.target.name, setChecked, checked, setCurrentKey)}
          />
        </div>
        <div className=" flex flex-col justify-center gap-2">
          <p className="text-white w-full text-center">בחר גרף</p>
          <div className="flex gap-2">
            <div className="flex flex-col border-2 border-gray-400 px-2">
              <label className="text-white">גרף בר</label>
              <input
                checked={selectedGraph.bar}
                name="bar"
                type="checkbox"
                onChange={(e) => setSelectedGraph((prev) => ({ ...prev, [e.target.name]: !prev[e.target.name as keyof typeof prev] }))}
              />
            </div>
            <div className="flex flex-col border-2 border-gray-400 px-2">
              <label className="text-white">גרף עוגה</label>
              <input
                checked={selectedGraph.pie}
                name="pie"
                type="checkbox"
                onChange={(e) => setSelectedGraph((prev) => ({ ...prev, [e.target.name]: !prev[e.target.name as keyof typeof prev] }))}
              />
            </div>
          </div>
        </div>
      </div>
      {!load ? (
        <div className="flex flex-col h-full">
          {selectedGraph.bar && <CastumBarChart hashTable={chartsData} />}
          {selectedGraph.pie && <PieChart_ hashTable={chartsData} />}
        </div>
      ) : (
        <h1 className={"text-xl8 text-center"}> טוען אינעל דינק ......</h1>
      )}
      {Array.isArray(currentData) && currentData.length > 0 && (
        <table className="table-auto">
          <thead className="bg-gray-800 ">
            <tr className="text-sm font-medium border-2 border-gray-200 text-gray-400 px-6 py-4 text-left">
              {Object.keys(currentData[0]).map((header) => (
                <td className="text-sm text-gray-400 font-light px-6 py-4 whitespace-nowrap">{header}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row: { [s: string]: ReactNode } | ArrayLike<ReactNode>) => (
              <tr className="bg-gray-600 border-b">
                {Object.values(row).map((cell) => (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{cell}</td>
                ))}
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      )}

      {visible && <Model handleClick={handleClick} text={myError.message} />}
      <div></div>
    </div>
  );
}

export default App;

const useGetQueryData = (
  setSellsData: React.Dispatch<React.SetStateAction<any[]>>,
  setTaxesData: React.Dispatch<React.SetStateAction<any[]>>,
  setSpacielCastumers: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const sellsData = useQuery({ queryKey: ["sells"], queryFn: getSellsData });
  const taxesData = useQuery({ queryKey: ["tax"], queryFn: getTaxesData });
  const spacielCastumers = useQuery({ queryKey: ["sc"], queryFn: getSpacielCastumers });

  useEffect(() => {
    if (taxesData.data) setTaxesData([...taxesData.data]);
    if (sellsData.data) setSellsData([...sellsData.data]);
    if (spacielCastumers.data) setSpacielCastumers([...spacielCastumers.data]);
  }, [sellsData.data, taxesData.data, spacielCastumers.data]);
};

const handleChecked = (
  name: string,
  setChecked: React.Dispatch<
    React.SetStateAction<{
      pro: boolean;
      regular: boolean;
      all: boolean;
    }>
  >,
  checked: {
    pro: boolean;
    regular: boolean;
    all: boolean;
  },
  setCurrentKey: React.Dispatch<React.SetStateAction<string | null>>
) => {
  let newObj: any = {};
  let keys = Object.keys(checked);
  keys.forEach((key: string) => (key == name ? (newObj[key] = !checked[key as keyof typeof checked]) : (newObj[key] = false)));
  setChecked({ ...newObj });
  const key = Object.entries(newObj).filter((row) => row[1] == true)[0][0];
  setCurrentKey(key ?? null);
};

const filterRelevantCastumers = async (data: any[], castumers: any[], key: string | null): Promise<any[] | null> => {
  console.log({ data, castumers, key });

  let proList: string[] = [];
  let regularList: string[] = [];
  let allList: string[] = [];
  castumers.forEach((castumer) => (castumer.pro ? proList.push(castumer.key) : regularList.push(castumer.key)));
  allList = [...proList, ...regularList];

  const hashList = { all: allList, pro: proList, regular: regularList };
  return new Promise((resolve, reject) => {
    if (!key) resolve(null);
    else {
      const newData = data.filter((row) => hashList[key as keyof typeof hashList].find((element) => element == row["לקוח/ספק"]));
      console.log({ newData });
      resolve(newData);
    }
  });
};

// casatuymer

// id
// :
// "544860882"
// key
// :
// "6026"
// name
// :
// "ש.ב חנויות נוחות בע\"מ"
// orderd
// :
// false
// phone
// :
// "544860882"
// pro
// :
// true

// data row
// אסמכ'
// :
// 301001
// חשבון הוצאות
// :
// "7300"
// חשבון הכנסות חייב במע&quot;מ
// :
// null
// יתרת פתוחים
// :
// 4
// כמות מקורית
// :
// 5
// לקוח/ספק
// :
// "7030"
// מחיר נטו
// :
// 90
// סה&quot;כ במסמך
// :
// 526.5
// סה&quot;כ בתנועה
// :
// 450
// סוג מסמך
// :
// "ת.מ.רכש"
// סוכן
// :
// 0
// פרטים
// :
// null
// פריט
// :
// "BB"
// שם חשבון במסמך
// :
// "נחום קס"
// שם חשבון הכנסות / הוצאות
// :
// "קניית גת ישראלי"
// שם פריט
// :
// "גת בייבי מוצר אב"
// תאריך
// :
// "2022-04-03T21:00:00.000Z"
