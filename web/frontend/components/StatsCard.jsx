import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useAuthenticatedFetch } from "../hooks";

export function Chart() {
  const [data, setData] = useState([]);
  
  const fetch = useAuthenticatedFetch()

  useEffect(() => {
    const fetchClickData = async () => {
      const response = await fetch("/api/clicks");
      setData(response.data);
    };
    fetchClickData();
  }, []);

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
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};