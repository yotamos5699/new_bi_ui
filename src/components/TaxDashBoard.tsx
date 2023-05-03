import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { getAddedTaxData } from "../tempApi";
import Speener from "./Speener";
import { useEffect, useState } from "react";
import { updateTable } from "../utils";
import { data } from "autoprefixer";
import { PivotData } from "../typing";
import CastumBarChart from "./BarChart";

function TaxDashBoard({
  sellsData,
  taxesData,
  pivot,
  taxCounter,
}: {
  sellsData: any[];
  taxesData: any[];
  pivot: PivotData;
  taxCounter: number;
}) {
  console.log({ taxesData, sellsData });
  const [dashBoardData, setDashBoardData] = useState<any>();
  const addedData = useQuery({ queryKey: ["addedData"], queryFn: getAddedTaxData });
  useDashBoardData({ addedData, setDashBoardData, pivot, sellsData, taxesData, taxCounter });
  useEffect(() => {
    if (dashBoardData) console.log({ dashBoardData });
  }, [dashBoardData]);

  if (!addedData.data || !dashBoardData?.sells || !dashBoardData?.expenses) return <Speener loading={true} Color={null} />;
  return (
    <div className={"flex flex-col"}>
      <CastumBarChart hashTable={dashBoardData.sells} />
      <CastumBarChart hashTable={dashBoardData.expenses} />
    </div>
  );
}

export default TaxDashBoard;

const getAddedData = (addedData: any[], startDate: any, endDate: any) => {
  let addedSells;
  let addedExpanses;
  for (let i = 0; i <= addedData.length - 1; i++) {
    if (addedData[i]["תאריך"] < startDate || addedData[i]["תאריך"] > endDate) continue;
    if (addedData[i]["סוג"] == "הוצאות") addedExpanses += addedData[i]["סכום כולל"];
    if (addedData[i]["סוג"] == "הכנסות") addedSells += addedData[i]["סכום כולל"];
  }
  return { addedSells, addedExpanses };
};

const useDashBoardData = ({
  addedData,
  pivot,
  setDashBoardData,
  sellsData,
  taxesData,
  taxCounter,
}: {
  addedData: UseQueryResult<any, unknown>;
  pivot: PivotData;
  setDashBoardData: React.Dispatch<any>;
  sellsData: any[];
  taxesData: any[];
  taxCounter: number;
}) => {
  useEffect(() => {
    const getData = async () => {
      const { addedSells, addedExpanses } = getAddedData(addedData.data, pivot.startinDate, pivot.endingDate);
      const sellsRes = (await updateTable(sellsData, { ...pivot, pivotKey: "שם חשבון הכנסות / הוצאות" })).data;
      const taxesRes = (await updateTable(taxesData, { ...pivot, pivotKey: "שם חשבון חובה" })).data;
      if (addedSells && sellsRes) sellsRes["הכנסות נוספות"] = addedSells;
      if (addedExpanses && taxesRes) taxesRes["הוצאות נוספות"] = addedExpanses;
      setDashBoardData({ sells: { ...sellsRes }, expenses: { ...taxesRes } });
    };
    if (addedData.data) {
      getData();
    }
  }, [taxCounter]);
};

// 0
// :
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

// אסמ'
// :
// 0
// אסמ'2
// :
// 423
// אסמ' 3
// :
// 0
// ח-ן נגדי
// :
// "7083"
// חובה / זכות (שקל)
// :
// -365.67
// יתרה (שקל)
// :
// -365.67
// כותרת
// :
// 30454
// מנה
// :
// 36
// ס&quot;ת
// :
// "חס8"
// סה&quot;כ שקל בתנועה
// :
// 2516.67
// פרטים
// :
// "פלג את אופק תבלינים"
// שם חשבון זכות
// :
// "פלג את אופק תבלינים"
// שם חשבון חובה
// :
// "קניות גת"
// ת.אסמכ
// :
// "2020-08-10T21:00:00.000Z"
// תאריך.3
// :
// "2020-12-30T22:00:00.000Z"
// תנועה
// :
// 73071
