//import "./index.css";
import { ReactNode, SetStateAction, useEffect, useState } from "react";
import CastumBarChart from "./components/BarChart";
import Model from "./components/Model";
import Select from "./components/Select";

import {
  getAccountisData,
  getSellsData,
  getSpacielCastumers,
  getTaxesData,
} from "./tempApi";
import { PivotData, chartsPivot } from "./typing.d";
import { useQueries, useQuery } from "@tanstack/react-query";
import PieChart_ from "./components/PieChart";
import Speener from "./components/Speener";
import Nav from "./components/Nav";
import { checkPivotData, updateTable } from "./utils";
import TaxDashBoard from "./components/TaxDashBoard";

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

function App() {
  const [sellsData, setSellsData] = useState<any[] | null>(null);
  const [selectedGraph, setSelectedGraph] = useState({
    bar: false,
    pie: false,
  });

  const [checked, setChecked] = useState({
    pro: false,
    regular: false,
    all: false,
  });
  const [currentKey, setCurrentKey] = useState<null | string>(null);
  const [taxesData, setTaxesData] = useState<any[] | null>(null);
  const [spacielCastumers, setSpacielCastumers] = useState<any[] | null>(null);
  const [pivot, setPivot] = useState<PivotData>({
    startinDate: undefined,
    endingDate: undefined,
    pivotKey: undefined,
  });
  const [itemsNames, setItemsNames] = useState<any[]>();
  const [taxCounter, setTaxCounter] = useState(0);
  const [dataType, setDataType] = useState<string>("");
  const [myError, setError] = useState({ show: false, message: "" });
  const [visible, setVisible] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<any>({});
  const [load, setLoad] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>();

  useGetQueryData(setSellsData, setTaxesData, setSpacielCastumers);

  const handleSelect = async (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name == "select") {
      setPivot((prev) => ({ ...prev, pivotKey: chartsPivot[value] }));
    }
    if (name == "select2") setDataType(value);

    if (name == "end") setPivot((prev) => ({ ...prev, endingDate: value }));
    if (name == "start") setPivot((prev) => ({ ...prev, startinDate: value }));
    // console.log({ pivot });
    // await updateTable();
  };

  useEffect(() => {
    console.log({ checked });
  }, [checked]);
  const handleClick = async (e: any) => {
    let isPivotDataOk = checkPivotData(pivot);
    let data2Update: any = null;
    if (dataType == "מע'מ") {
      setTaxCounter((prev) => prev + 1);
      return;
    }
    if (e.target.name == "submit" && isPivotDataOk === false)
      setVisible((prev) => !prev);
    else if (e.target.name == "submit" && sellsData && spacielCastumers) {
      setLoad(true);
      const checkedData = await filterRelevantCastumers(
        sellsData,
        spacielCastumers,
        currentKey
      );
      if ((currentKey && !checkedData) || checkedData?.length == 0) {
        setError({ show: true, message: " מחזיר מידע מלא ,אין שורות להציג" });
        setVisible((prev) => !prev);
      } else {
        data2Update = checkedData;
      }
      console.log({ data2Update });
      setLoad(true);
      const { isLoading, data, items, CurrentData } = await updateTable(
        data2Update ?? sellsData,
        pivot
      );
      setChartsData(data);
      setItemsNames(items);
      setCurrentData(CurrentData);
      setLoad(isLoading);
    }
    if (e.target?.id == "pop_up" || e.taerget?.id == "pop_up_text") {
      setVisible((prev) => !prev);
    }
  };
  if (!sellsData || !spacielCastumers)
    return <Speener loading={true} Color={null} />;

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <Nav
        dataType={dataType}
        handleClick={handleClick}
        setPivot={setPivot}
        handleSelect={handleSelect}
        pivot={pivot}
        checked={checked}
        setChecked={setChecked}
        handleChecked={handleChecked}
        setSelectedGraph={setSelectedGraph}
        setCurrentKey={setCurrentKey}
        selectedGraph={selectedGraph}
      />
      {!load ? (
        dataType == "מע'מ" && taxesData && sellsData ? (
          <TaxDashBoard
            sellsData={sellsData}
            taxesData={taxesData}
            pivot={pivot}
            taxCounter={taxCounter}
          />
        ) : dataType == "רוא'ח" ? (
          <AccountisData />
        ) : (
          <div className="flex flex-col h-full">
            {selectedGraph.bar && <CastumBarChart hashTable={chartsData} />}
            {selectedGraph.pie && <PieChart_ hashTable={chartsData} />}
          </div>
        )
      ) : (
        <h1 className={"text-xl8 text-center"}> טוען אינעל דינק ......</h1>
      )}
      {currentData && (
        <div className="flex">
          <table className="table-auto">
            <thead className="bg-gray-800 ">
              <tr className="text-sm font-medium border-2 border-gray-200 text-gray-400 px-6 py-4 text-left">
                {Object.keys(currentData[0]).map((header) => (
                  <td className="text-sm text-gray-400 font-light px-6 py-4 whitespace-nowrap">
                    {header}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map(
                (row: { [s: string]: ReactNode } | ArrayLike<ReactNode>) => (
                  <tr className="bg-gray-600 border-b">
                    {Object.values(row).map((cell) => (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              )}
              <tr></tr>
            </tbody>
          </table>
        </div>
      )}

      {visible && <Model handleClick={handleClick} text={myError.message} />}
      <div></div>
    </div>
  );
}

export default App;

const AccountisData = () => {
  const data = useQuery({ queryKey: ["accountis"], queryFn: getAccountisData });
  if (data.error) return <h1>error...</h1>;
  if (data.isLoading) return <Speener loading={true} Color={null} />;
  return (
    <div className="flex flex-col text-white justify-center gap-2">
      {data.data &&
        data.data.map((row: any) => (
          <div className="flex  flex-row-reverse gap-4">
            {Object.keys(row).map((key) => (
              <p className="flex flex-row-reverse gap-2">
                <span>{key}</span>
                <span>{row[key]}</span>
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

const useGetQueryData = (
  setSellsData: React.Dispatch<React.SetStateAction<any[] | null>>,
  setTaxesData: React.Dispatch<React.SetStateAction<any[] | null>>,
  setSpacielCastumers: React.Dispatch<React.SetStateAction<any[] | null>>
) => {
  const sellsData = useQuery({ queryKey: ["sells"], queryFn: getSellsData });
  const taxesData = useQuery({ queryKey: ["tax"], queryFn: getTaxesData });
  const spacielCastumers = useQuery({
    queryKey: ["sc"],
    queryFn: getSpacielCastumers,
  });

  useEffect(() => {
    if (taxesData.data) {
      setTaxesData([...taxesData.data]);
      console.log("taxes data:", taxesData.data);
    }
    if (sellsData.data) {
      setSellsData([...sellsData.data]);
    }
    if (spacielCastumers.data) {
      setSpacielCastumers([...spacielCastumers.data]);
    }
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
  keys.forEach((key: string) =>
    key == name
      ? (newObj[key] = !checked[key as keyof typeof checked])
      : (newObj[key] = false)
  );
  setChecked({ ...newObj });
  const res = Object.entries(newObj).filter((row) => row[1] == true)[0];
  const key = res ? res[0] : null;
  setCurrentKey(key);
};
export type HandleCheackedType = typeof handleChecked;
const filterRelevantCastumers = async (
  data: any[],
  castumers: any[],
  key: string | null
): Promise<any[] | null> => {
  console.log({ data, castumers, key });

  let proList: string[] = [];
  let regularList: string[] = [];
  let allList: string[] = [];
  castumers.forEach((castumer) =>
    castumer.pro ? proList.push(castumer.key) : regularList.push(castumer.key)
  );
  allList = [...proList, ...regularList];

  const hashList = { all: allList, pro: proList, regular: regularList };
  return new Promise((resolve, reject) => {
    if (!key) resolve(null);
    else {
      const newData = data.filter((row) =>
        hashList[key as keyof typeof hashList].find(
          (element) => element == row["לקוח/ספק"]
        )
      );
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
