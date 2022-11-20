export const chartsPivot: { [key: string]: string } = {
  לקוחות: "שם חשבון במסמך",
  פריטים: "פריט",
  "כרטיס מרכז": "שם חשבון הכנסות / הוצאות",
};

export type PivotData = {
  startinDate: string | undefined;
  endingDate: string | undefined;
  pivotKey: string | undefined;
};

export type barChartProps = {
  hashTable: { [key: string]: any };
  // ...rest of your props
};
