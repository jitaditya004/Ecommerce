import { Product } from "./product";

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export type GetProductsResult = {
  products: Product[];
  total: number;
  error: boolean;
};
