import React, { useEffect, useState } from "react";
import { ListThingsCommand, ThingAttribute } from "@aws-sdk/client-iot";
import { useNavigate } from "react-router-dom";
import { iotClient } from "../awsConfig";


const IoTThingsList: React.FC = () => {
  const [things, setThings] = useState<ThingAttribute[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThings = async () => {
      try {
        const data = await iotClient.send(new ListThingsCommand({}));
        setThings(data.things || []);
      } catch (err) {
        console.error("Error fetching IoT things:", err);
      }
    };

    fetchThings();
  }, []);

  return (
    <div>
      <h1>IoT Things</h1>
      <ul>
        {things.map((thing) => (
          <li key={thing.thingName} onClick={() => navigate(`/${thing.thingName}`)}>
            {thing.thingName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IoTThingsList;
