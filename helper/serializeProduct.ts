export function serializeProduct(product: any) {
  if (!product) return null;

  return {
    ...product,
    product_id: product.product_id.toString(), // or Number()
  };
}
