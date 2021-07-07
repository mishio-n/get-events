import dotenv from "dotenv";
import axios from "axios";
import { Events, Labels } from "./schemas/timetree";
import fs from "fs";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";
const CALENDAR_ID = process.env.CALENDAR_ID || "";
const client = axios.create({ baseURL: "https://timetreeapis.com/" });

const ws = fs.createWriteStream("./events.csv");

(async () => {
  try {
    const { data: rawLabels } = await client.get<Labels>(
      `/calendars/${CALENDAR_ID}/labels`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const labels = rawLabels.data.map((label) => ({
      id: label.id,
      name: label.attributes.name,
    }));

    const { data: rawEvents } = await client.get<Events>(
      `/calendars/${CALENDAR_ID}/upcoming_events`,
      {
        params: {
          days: 7,
        },
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const events = rawEvents.data.map((event) => ({
      title: event.attributes.title,
      labelId: event.relationships.label.data.id,
    }));

    ws.write(`ラベル,予定の数\n`);
    labels.forEach((label) => {
      const relationEvents = events.filter(
        (event) => event.labelId === label.id
      );
      ws.write(`${label.name},${relationEvents.length}\n`);
    });
  } catch (error) {
    console.error(error);
  }
})();
