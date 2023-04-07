import { useState, useEffect } from 'react';
import { Chart } from './index';

export function ChartContainer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-GB');
    }).reverse();

    // Replace this with your actual data fetch logic
    const fetchedData = [
      { date: '2022-04-01', count: 5 },
      { date: '2022-04-03', count: 3 },
      { date: '2022-04-04', count: 7 },
      { date: '2022-04-06', count: 2 },
      { date: '2022-04-07', count: 10 },
    ];

    const formattedData = dates.map(date => {
      const matchingData = fetchedData.find(data => data.date === date);
      return {
        name: date,
        count: matchingData ? matchingData.count : 0,
      };
    });

    setData(formattedData);
  }, []);

  return (
    <div style = {{height:"200px"}}>
      {data.length ? (
        <Chart data={data} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}