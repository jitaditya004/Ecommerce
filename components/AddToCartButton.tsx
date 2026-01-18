"use client";

type Props = {
  productId: number;
  disabled: boolean;
};

export default function AddToCartButton({
  productId,
  disabled,
}: Props) {

  const handleAdd = async () => {
    const res = await fetch("http://localhost:3000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      alert("Please login first");
      return;
    }

    alert("Added to cart");
  };

  return (
    <button
      disabled={disabled}
      onClick={handleAdd}
      className="mt-6 bg-black text-white px-8 py-3 rounded-lg disabled:opacity-50"
    >
      Add to Cart
    </button>
  );
}
