import { useEffect } from "react";
import { PivotData } from "./typing";
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
    console.log({ tempData });
    return tempData;
  }

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
const checkPivotData = (pivot: PivotData) => {
  let isOk = true;
  Object.values(pivot).find((value) => {
    if (value === undefined) isOk = false;
  });
  return isOk;
};

export const updateTable = async (data: any, pivot: PivotData, itemsNames: any) => {
  if (checkPivotData(pivot)) {
    let filterdData = await formatChartsData(data, pivot);

    let filterdItems = await filterItemList(filterdData, pivot.pivotKey);
    let HashTable = await makeHashTable(filterdData, itemsNames, pivot.pivotKey ? pivot.pivotKey : "פריט");
    const loadState = false;
    return { filterdData, filterdItems, HashTable, loadState };
  }
};

export const useLoggger = (value: any, follow = true, emit?: boolean) => {
  const toLog = true;

  const data = { name: Object.keys({ value })[0], data: value };
  if (emit) return console.log({ data });
  if (toLog) return console.log({ data });
  if (toLog && follow)
    useEffect(() => {
      if (toLog) return console.log({ data });
    }, [value]);
};
