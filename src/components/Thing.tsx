import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';

// Initialize modules
HighchartsMore(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const Thing: React.FC = () => {
  const { thingId } = useParams<{ thingId: string }>();
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    if (!thingId) return;

    const ws = new WebSocket(`wss://myj8ks5z23.execute-api.us-east-1.amazonaws.com/dev/`);

    ws.onopen = () => {
      console.log(`Connected to WebSocket for thing: ${thingId}`);
    };

    ws.onmessage = (event) => {

        const dataComming = JSON.parse(event.data)
        console.log(dataComming.level)
        
      setData((prevData) => [...prevData, dataComming.level]);
    };

    ws.onclose = () => {
      console.log(`Disconnected from WebSocket for thing: ${thingId}`);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for thing: ${thingId}`, error);
    };

    return () => {
      ws.close();
    };
  }, [thingId]);

  const chartOptions = {
    chart: {
      type: 'line',
    },
    title: {
      text: `Real-time Data for ${thingId}`,
    },
    series: [
      {
        name: 'Real-time Data',
        data: data,
      },
    ],
  };

  return (
    <div>
      <h1>Thing: {thingId}</h1>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default Thing;
