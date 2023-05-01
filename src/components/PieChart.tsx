import React, { useCallback, useEffect, useState } from "react";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { pieChartProps, unit } from "../typing";

//import MuiTable from "../components/Tables/MuiTable";

const data = [
  { name: "אישרו הגעה", value: 55 },
  { name: "אומרים אולי", value: 32 },
  { name: "לא מגיעים", value: 11 },
  { name: "לא ענו", value: 77 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };
const keyHash: any = {
  "לא מגיעים": "סורב",
  "אומרים אולי": "אולי",
  "אישרו הגעה": "אושר",
  "לא ענו": "אין מענה",
};

export default function PieChart_({ hashTable }: pieChartProps) {
  //   const [toolTip, setToolTip] = useState(false);
  //   const [toTable, setToTable] = useState(false);
  //   const [sortKey, setSortKey] = useState<"אולי" | "אין מענה" | "אושר" | "סורב" | "לא נשלחה" | null>(null);

  let data: unit[] = [];
  Object.keys(hashTable).forEach((key) =>
    data.push({
      name: key,
      sum: hashTable[key],
    })
  );
  return (
    <>
      {" "}
      {/* <div className="container flex flex-col items-center justify-center px-4 py-16"> */}
      <ResponsiveContainer width="100%" aspect={2}>
        <PieChart
          width={200}
          height={200}
          // margin={{
          //   top: 5,
          //   right: 30,
          //   left: 20,
          //   bottom: 5,
          // }}
          // onClick={(e) => {
          // //   if (e?.activePayload) {
          // //     setSortKey(getSortKey(e));
          // //     // setToTable(true);
          // //   }
          // }}
        >
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label outerRadius={200} fill="#8884d8" dataKey="sum">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend className="w-full" />
        </PieChart>
      </ResponsiveContainer>
      {/* </div> */}
    </>
  );
}

export const getSortKey = (e: CategoricalChartState) => {
  if (e.activePayload) {
    const apl: { name: string; value: number } = e.activePayload[0].payload;
    const key = keyHash[apl.name];
    return key;
  }
};
