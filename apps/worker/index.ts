import Redis from "ioredis";
import client from "./utils/pgclient";
const redis = new Redis("redis://localhost:6379");

await client.connect();

async function processTasks() {
  while (true) {
    console.log("worker starting")
    const res = await redis.brpop("batchQueue", 0);
    const batch = JSON.parse(res?.[1]!);
    console.log("res", res)
    console.log("batch", batch)

    // const values = batch
    //   .map((_, i) => ` (TO_TIMESTAMP($${i * 2 + 1} / 1000.0), $${i * 2 + 2})`)
    //   .join(",");

    // const params = batch.flatMap((t) => [t.timestamp, t.base_price.int]);
    try {
      // await client.query(
      //   `INSERT INTO market_ticks (time, price_int) VALUES ${values}`,
      //   params
      // );
    } catch (error) {
      console.log(error);
    }
  }
}

processTasks().catch(console.error);