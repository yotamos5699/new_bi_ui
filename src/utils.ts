import { PivotData } from "./typing";

const formatChartsData = async (data: any, pivotData: PivotData) => {
  console.log("in formatChartsData ", { data, pivotData });
  let filtedData: any = [];
  if (!pivotData.endingDate || !pivotData.startinDate) return;
  for (let i = 0; i <= data.length - 1; i++) {
    let dateString =
      pivotData.pivotKey == "שם חשבון חובה"
        ? data[i]["ת.אסמכ"]
        : data[i]["תאריך"];

    let thisDate = new Date(dateString).getTime();
    let END_TIME = new Date(pivotData.endingDate).getTime();
    let START_TIME = new Date(pivotData.startinDate).getTime();

    if (thisDate >= START_TIME && thisDate <= END_TIME) {
      if (pivotData.pivotKey == "שם חשבון חובה") {
        filtedData.push(data[i]);
      } else {
        let currentCard = data[i]["לקוח/ספק"];
        if (currentCard > "6024" && currentCard < "7000")
          filtedData.push(data[i]);
      }
    }
  }
  console.log("resualt", { filtedData });
  return filtedData;
};

export const makeHashTable = async (
  FilterdData: any,
  keys: any,
  key: string | "פריט"
) => {
  let hashTable: { [key: string]: number } = {};

  for (let i = 0; i <= keys.length - 1; i++) {
    hashTable[keys[i]] = 0;
  }

  let sortKey =
    key == "סוכן"
      ? "כמות מקורית"
      : key == "שם חשבון חובה"
      ? "סה&quot;כ שקל בתנועה"
      : "סה&quot;כ בתנועה";
  for (let i = 0; i <= FilterdData.length - 1; i++) {
    hashTable[FilterdData[i][key]] += -FilterdData[i][sortKey];
  }

  return hashTable;
};
const filterItemList = async (data: object[], key: string = "פריט") => {
  return [...new Set(data.map((row: any) => row[key]))];
};

export const checkPivotData = (pivot: PivotData) => {
  let isOk = true;
  Object.values(pivot).find((value) => {
    if (value === undefined) isOk = false;
  });
  return isOk;
};
export const updateTable = async (data: any[], pivot: any) => {
  console.log({ data, pivot });
  let fData;
  let fItems;
  let cData;

  if (checkPivotData(pivot)) {
    let filterdData = await formatChartsData(data, pivot);
    let filterdItems = await filterItemList(filterdData, pivot.pivotKey);
    cData = filterdData;
    fItems = filterdItems;
    fData = filterdData;
    let HashTable = await makeHashTable(
      filterdData,
      filterdItems,
      pivot.pivotKey ? pivot.pivotKey : "פריט"
    );
    fData = HashTable;
  }

  return { isLoading: false, data: fData, items: fItems, CurrentData: cData };
};
