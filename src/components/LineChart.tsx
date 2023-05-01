import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { chartColors } from "../interfaces";
// import * as mockData from "../mockData.json";

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
