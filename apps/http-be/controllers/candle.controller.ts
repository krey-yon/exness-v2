import client from "../utils/pgClient";
import type { Request, Response } from "express";

export async function getCandles(req: Request, res: Response) {
  const { symbol, interval } = req.query;

  if (!symbol && !interval) {
    return res.send("no query params in req");
  }
  let data;
  switch (symbol) {
    case "ETHUSDT":
      switch (interval) {
        case "1min":
          data = await get1minCandles("ETHUSDT");
          break;
        case "5min":
          data = await get5minCandles("ETHUSDT");
          break;
        case "15min":
          data = await get15minCandles("ETHUSDT");
          break;
        case "30min":
          data = await get30minCandles("ETHUSDT");
          break;
        case "1hr":
          data = await get1hrCandles("ETHUSDT");
          break;
        default:
          break;
      }
      res.json(data);
      break;

    case "SOLUSDT":
      switch (interval) {
        case "1min":
          data = await get1minCandles("SOLUSDT");
          break;
        case "5min":
          data = await get5minCandles("SOLUSDT");
          break;
        case "15min":
          data = await get15minCandles("SOLUSDT");
          break;
        case "30min":
          data = await get30minCandles("SOLUSDT");
          break;
        case "1hr":
          data = await get1hrCandles("SOLUSDT");
          break;
        default:
          break;
      }
      res.json(data);
      break;

    case "BTCUSDT":
      switch (interval) {
        case "1min":
          data = await get1minCandles("BTCUSDT");
          break;
        case "5min":
          data = await get5minCandles("BTCUSDT");
          break;
        case "15min":
          data = await get15minCandles("BTCUSDT");
          break;
        case "30min":
          data = await get30minCandles("BTCUSDT");
          break;
        case "1hr":
          data = await get1hrCandles("BTCUSDT");
          break;
        default:
          break;
      }
      res.json(data);
      break;

    default:
      break;
  }
}

async function get1minCandles(symbol: string) {
  const query = `
        SELECT * FROM candles_1min
        WHERE symbol = '${symbol}'
        ORDER BY bucket DESC;
    `;
  const data = await client.query(query);
  return data.rows;
}

async function get5minCandles(symbol: string) {
  const query = `
        SELECT * FROM candles_5min
        WHERE symbol = '${symbol}'
        ORDER BY bucket DESC;
    `;
  const data = await client.query(query);
  return data.rows;
}

async function get15minCandles(symbol: string) {
  const query = `
        SELECT * FROM candles_15min
        WHERE symbol = '${symbol}'
        ORDER BY bucket DESC;
    `;
  const data = await client.query(query);
  return data.rows;
}

async function get30minCandles(symbol: string) {
  const query = `
        SELECT * FROM candles_30min
        WHERE symbol = '${symbol}'
        ORDER BY bucket DESC;
    `;
  const data = await client.query(query);
  return data.rows;
}

async function get1hrCandles(symbol: string) {
  const query = `
        SELECT * FROM candles_1hour
        WHERE symbol = '${symbol}'
        ORDER BY bucket DESC;
    `;
  const data = await client.query(query);
  return data.rows;
}
