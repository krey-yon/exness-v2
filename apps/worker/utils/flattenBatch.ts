import type { batchType } from "../type";

export function flattenBatch(batch: any[]): batchType[] {
  const flat: batchType[] = [];

  for (const item of batch) {
    if (!item.marketData) continue;

    for (const [stream, trades] of Object.entries<any[]>(item.marketData)) {
      const symbol = stream.split("@")[0]?.toUpperCase();

      if (symbol) {
        for (const trade of trades) {
          flat.push({
            symbol,
            basePrice: trade.basePrice,
            decimal: trade.decimal,
            buyPrice: trade.buyPrice,
            sellPrice: trade.sellPrice,
            timestamp: trade.timestamp,
          });
        }
      }
    }
  }

  return flat;
}
