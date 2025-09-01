import express, { type Request, type Response } from "express";
import client from "./utils/pgClient";
import Redis from "ioredis";
import { getCandles } from "./controllers/candle.controller";

const app = express()
const port = 8000

await client.connect()
const redis = new Redis("redis://localhost:6379")

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// /api/data?symbol=BTCUSDT&interval=1min
app.get("/candle-data", getCandles)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
