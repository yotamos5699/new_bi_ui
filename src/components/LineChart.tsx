import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { chartColors } from "../interfaces";
import * as mockData from "../mockData.json";

// const data = [
//   { name: "moshe", sun: 23, mon: 55, thus: 99 },
//   { name: "rami", sun: 55, mon: 31, thus: 12 },
//   { name: "yafit", sun: 61, mon: 77, thus: 46 },
//   { name: "elior", sun: 23, mon: 4, thus: 16 },
//   { name: "don", sun: 32, mon: 76, thus: 22 },
// ];
// function getWeekLimits(currentDate: string) {
//   let fDate = new Date(currentDate);
//   const firstDay = new Date(fDate.setDate(fDate.getDate() - fDate.getDay()));
//   const lastDay = new Date(fDate.setDate(fDate.getDate() - fDate.getDay() + 6));

//   return { start: firstDay, end: lastDay };
// }

// async function formateLineChartByDate(data: any[], items: string[], pivot: string) {
//   let formatedData = [];
//   let currentDate: string = data[0]["תאריך"];
//   let dailyRecord: any = {};
//   let weeklyRecords: any = {};
//   let monthlyRecords: any = {};
//   let week = getWeekLimits(currentDate);

//   let currentMonth = new Date(currentDate).getMonth() + 1;

//   for (let i = 0; i <= data.length - 1; i++) {
//     if (currentDate != data[i]["תאריך"]) {
//       formatedData.push(dailyRecord);
//       currentDate = data[i]["תאריך"];
//       dailyRecord = {};
//       dailyRecord.data = currentDate;
//       items.forEach((item) => (dailyRecord[item] = data[i][pivot] == item ? -data[i]["סה&quot;כ בתנועה"] : 0));
//     }
//     dailyRecord[data[i][pivot]] += -data[i]["סה&quot;כ בתנועה"];
//   }
// }

function Line_Chart() {
  //mockData;

  return (
    <div>
      <>line chart</>
      {/* <h1>Charts</h1>
      <LineChart width={800} height={400} data={data}>
        {Object.keys(data[0]).map((key, idx) => {
          if (idx != 0) {
            console.log({ key, idx });
            return <Line key={idx} type="monotone" dataKey={key} stroke={chartColors[idx]} strokeWidth={3} />;
          }
        })}
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart> */}
    </div>
  );
}
export default Line_Chart;
