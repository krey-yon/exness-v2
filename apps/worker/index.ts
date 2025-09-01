import Redis from "ioredis";
import client from "./utils/pgclient";
import { flattenBatch } from "./utils/flattenBatch";
const redis = new Redis("redis://localhost:6379");

await client.connect();

async function processTasks() {
  console.log("worker starting");
  let index = 0;
  while (true) {
    const res = await redis.brpop("batchQueue", 0);
    const batch = JSON.parse(res?.[1]!);
    // console.dir(batch, { depth: null });
    const flattenedTrades = flattenBatch(batch);
    const values = flattenedTrades
      .map(
        (_: unknown, i: number) =>
          `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, TO_TIMESTAMP($${i * 6 + 6} / 1000.0))`
      )
      .join(",");

    const params = flattenedTrades.flatMap((trade) => [
      trade.symbol,
      trade.basePrice,
      trade.decimal,
      trade.buyPrice,
      trade.sellPrice,
      trade.timestamp,
    ]);

    try {
      const res = await client.query(
        `INSERT INTO market_data (symbol, basePrice, decimal, buyPrice, sellPrice, timestamp) VALUES ${values} ON CONFLICT (symbol, timestamp) DO NOTHING`,
        params
      );
      console.log(`Successfully inserted ${res.rowCount} rows.`);
    } catch (error) {
      console.log(error);
    }
  }
}

processTasks().catch(console.error);
