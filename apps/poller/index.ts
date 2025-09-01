import Redis from "ioredis";
import WebSocket, { type RawData } from "ws";
import { parseMarketData } from "./utils/parseData";

const endpoint =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

const socket = new WebSocket(endpoint);

const redis = new Redis("redis://localhost:6379");

let buffer: any[] = [];
const BATCH_SIZE = 500;

function grabData(rawdata: any) {
  buffer.push(rawdata);

  if (buffer.length >= BATCH_SIZE) {
    flushBuffer().catch(console.error);
  }
}
async function flushBuffer() {
  if (buffer.length === 0) return;

  const batch = buffer;
  buffer = [];

  await redis.lpush("batchQueue", JSON.stringify(batch));

  console.log(`Enqueued batch of size ${batch.length} ${Date.now()}`);
}
setInterval(() => {
  flushBuffer().catch(console.error);
}, 500);

socket.on("message", (rawdata: RawData) => {
  const data = JSON.parse(rawdata.toString());
  const res = parseMarketData(data)
  grabData(res)
  redis.publish("marketdata", JSON.stringify(res));
});
