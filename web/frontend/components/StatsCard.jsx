import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthenticatedFetch } from "../hooks";
import { Card, Heading } from "@shopify/polaris"

export function Chart(){
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState()
  const fetch = useAuthenticatedFetch();
  const title = `Clicks on Accesories in the last seven days: ${counter}`
  useEffect(() => {
    // Fetch data from API and set state
    fetch('/api/total-clicks')
    .then(response => response.json())
    .then(data => setCounter(data))
    .catch(error => console.error(error));

    fetch('/api/info')
      .then(response => response.json())
      .then(data => {
          console.log(data)
        const formattedData = data.map(obj => ({
          name: obj.date,
          count: obj.count,
        }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Card
    title = {title}
    sectioned
    >  
    <div style = {{height: "200px"}}>      
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={300}
        height={400}
        data={data}
      >
       
        <XAxis dataKey="name" />
        <YAxis interval={0} ticks={[1, 10, 20, 30, 40, 50]} />
        <Tooltip />
        <Bar dataKey="count" fill="red" />
      </BarChart>
    </ResponsiveContainer>
    </div>
    </Card>
  );
};

