export function rateLimit({ interval }: { interval: number }) {
  const tokens = new Map();
  const buckets = new Map();

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const bucket = Math.floor(now / interval);

        if (buckets.get(token) !== bucket) {
          tokens.set(token, 0);
          buckets.set(token, bucket);
        }

        const count = tokens.get(token) || 0;
        if (count >= limit) {
          return reject(new Error("Rate limit exceeded"));
        }

        tokens.set(token, count + 1);
        return resolve();
      }),
  };
}
