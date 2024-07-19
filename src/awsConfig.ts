import { IoTClient } from "@aws-sdk/client-iot";
import { IoTDataPlaneClient } from "@aws-sdk/client-iot-data-plane";
const REGION = process.env.AWS_REGION;

const iotClient = new IoTClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const iotDataClient = new IoTDataPlaneClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export { iotClient, iotDataClient };