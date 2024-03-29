import { chartColors } from "../interfaces";
import { barChartProps, unit } from "../typing.d";

import React, { PureComponent } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CastumBarChart: React.FC<barChartProps> = ({ hashTable }) => {
  let data: unit[] = [];
  Object.keys(hashTable).forEach((key) =>
    data.push({
      name: key,
      sum: hashTable[key],
    })
  );
  console.log("data in bar chart ", data);

  return (
    <ResponsiveContainer width="100%" aspect={3}>
      {data.length > 1 ? (
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            //    domain={[0, 6000000]}
            allowDataOverflow={true}
            // interval={0}
            //  tickCount={8}
            // ticks={[0, 1000, 2500, 5000, 10000, 50000, 100000, 1000000]}
            // scale="identity"
            //tickSize={50}
            //tickMargin={50}
          />

          <Tooltip />
          <Legend />
          <Bar dataKey="sum" fill="#8884d8" />
          {/* <Bar dataKey="pv" fill="#82ca9d" /> */}
        </BarChart>
      ) : (
        <>loading....</>
      )}
    </ResponsiveContainer>
  );
};

export default CastumBarChart;
// => {
//   console.log("hash table in bar chart ", hashTable);
//   let data: unit[] = [];
//   Object.keys(hashTable).forEach((key) => data.push({ name: key, sum: hashTable[key] }));

//   console.log("data in bar chart ", data);
//   return (
//     <div>
//       <h1>Charts</h1>

//       <ResponsiveContainer width="100%" aspect={3}>
//         {data && (
//           <BarChart
//             width={800}
//             height={400}
//             data={data}
//             // margin={{
//             //   top: 20,
//             //   right: 30,
//             //   left: 20,
//             //   bottom: 5,
//             // }}
//           >
//             <XAxis dataKey="name" />
//             <YAxis />
//             {data.map((barData: any, idx) => {
//               console.log(barData);
//               return <Bar dataKey="sum" fill={chartColors[idx]} />;
//             })}

//             {/* <Bar dataKey="sum" /> */}
//             {/* <CartesianGrid stroke="#ccc" /> */}
//           </BarChart>
//         )}
//       </ResponsiveContainer>
//     </div>
//   );
// };
// export default CastumBarChart;
