
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { day: "Monday", value: 5 },
  { day: "Tuesday", value: 8 },
  { day: "Wednesday", value: 2 },
  { day: "Thursday", value: 4 },
  { day: "Friday", value: 7 },
  { day: "Saturday", value: 9 },
  { day: "Sunday", value: 1 },
];

export function Chart() {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="value" />
      <YAxis dataKey="day" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};
