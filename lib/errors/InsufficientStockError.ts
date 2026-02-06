export class InsufficientStockError extends Error {
  code = "INSUFFICIENT_STOCK" as const;
  items: {
    productId: bigint;
    available: number;
    requested: number;
  }[];

  constructor(items: InsufficientStockError["items"]) {
    super("Insufficient stock");
    this.items = items;
  }
}
