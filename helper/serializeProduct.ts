import {products} from "@prisma/client";

export function serializeProduct(product: products | null) {
  if (!product) return null;

  return {
    ...product,
    product_id: product.product_id.toString(), // or Number()
  };
}
