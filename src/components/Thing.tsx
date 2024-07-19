import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { GetThingShadowCommand } from '@aws-sdk/client-iot-data-plane';
import { iotDataClient } from '../awsConfig';


// Initialize Highcharts modules
HighchartsMore(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const Thing: React.FC = () => {
  const { thingId } = useParams<{ thingId: string }>();
  const [data, setData] = useState<{ CO: number[]; CO2: number[]; Propane: number[] }>({
    CO: [],
    CO2: [],
    Propane: [],
  });
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (!thingId) return;

    // WebSocket connection
    const ws = new WebSocket(`wss://myj8ks5z23.execute-api.us-east-1.amazonaws.com/dev/`);

    ws.onopen = () => {
      console.log(`Connected to WebSocket`);
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      if (newData.device_id === thingId) {
        setData((prevData) => ({
          CO: [...prevData.CO, newData.CO],
          CO2: [...prevData.CO2, newData.CO2],
          Propane: [...prevData.Propane, newData.Propane],
        }));
      }
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

  useEffect(() => {
    if (!thingId) return;

    // Fetch thing shadow to get the connected attribute
    const fetchThingShadow = async () => {
      try {
        const data = await iotDataClient.send(new GetThingShadowCommand({ thingName: thingId }));
        const shadowPayload = JSON.parse(new TextDecoder('utf-8').decode(data.payload));
        const isConnected = shadowPayload.state?.reported?.connected;
        setConnected(isConnected);
      } catch (err) {
        console.error("Error fetching thing shadow:", err);
      }
    };

    fetchThingShadow();
  }, [thingId]);

  const chartOptions = (title: string, seriesData: number[]) => ({
    chart: {
      type: 'line',
    },
    title: {
      text: title,
    },
    series: [
      {
        name: title,
        data: seriesData,
      },
    ],
  });

  return (
    <div>
      <h1>Thing: {thingId}</h1>
      <p>Connected: {connected !== null ? (connected ? 'Yes' : 'No') : 'Loading...'}</p>
      <div>
        <h2>CO Level</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions('CO Level', data.CO)} />
      </div>
      <div>
        <h2>CO2 Level</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions('CO2 Level', data.CO2)} />
      </div>
      <div>
        <h2>Propane Level</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions('Propane Level', data.Propane)} />
      </div>
    </div>
  );
};

export default Thing;
