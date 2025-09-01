import express, { type Request, type Response } from "express";
import client from "./utils/pgClient";
import Redis from "ioredis";
import { getCandles } from "./controllers/candle.controller";
import { createUser, signInUser } from "./controllers/users.controller";

const app = express()
const port = 8000

app.use(express.json())

await client.connect()
const redis = new Redis("redis://localhost:6379")

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// /api/data?symbol=BTCUSDT&interval=1min
app.get("/candle-data", getCandles)

app.post("/signup", createUser)
app.post("/signin", signInUser)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
