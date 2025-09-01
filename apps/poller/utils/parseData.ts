type RawTradeMessage = {
  stream: string;
  data: {
    p: string;
    T: number;
    [key: string]: any;
  };
};

type ParsedData = {
  marketData: {
    [stream: string]: {
      basePrice: number;
      decimal: number;
      buyPrice: number;
      sellPrice: number;
      timestamp: number;
    }[];
  };
};

export function parseMarketData(
  messages: RawTradeMessage | RawTradeMessage[]
): ParsedData {
  const result: ParsedData = { marketData: {} };

  const msgs = Array.isArray(messages) ? messages : [messages];

  for (const msg of msgs) {
    const { stream, data } = msg;
    const basePrice = parseFloat((parseFloat(data.p) * 10000).toFixed(2));
    const decimal = 4;
    const spread = basePrice * Math.random() * 0.005;
    const buyPrice = basePrice + spread;
    const sellPrice = basePrice - spread;
    const timestamp = data.T;

    if (!result.marketData[stream]) {
      result.marketData[stream] = [];
    }

    result.marketData[stream].push({
      basePrice,
      decimal,
      buyPrice,
      sellPrice,
      timestamp,
    });
  }

  return result;
}
