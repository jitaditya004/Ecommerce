// types/errors.ts
export interface InsufficientStockErrorResponse {
  code: "INSUFFICIENT_STOCK";
  items: {
    productId: number;
    available: number;
    requested: number;
  }[];
}
