import ProductGrid from "@/components/ProductGrid";
import ControlsServer from "@/components/ControlsServer";
import { Suspense } from "react";
import { publicFetch } from "@/lib/publicFetch";
import { Product } from "@/types/product";
// import Link from "next/link";

interface ProductsResponse {
  products: Product[];
  total: number;
};

type GetProductsResult = {
  products: Product[];
  total: number;
  error: boolean;
};

type CollectionSearchParams = {
  page?: string;
  limit?: string;
  sort?: string;
};


async function getProducts(searchParams: Promise<CollectionSearchParams>): Promise<GetProductsResult> {
  const page = (await searchParams).page ?? "1";
  const limit = (await searchParams).limit ?? "12";
  const sort = (await searchParams).sort ?? "recent";

  const res = await publicFetch<ProductsResponse>(
    `/products?page=${page}&limit=${limit}&sort=${sort}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error(`Failed to fetch products: ${res.status} - ${res.message}`);
    throw new Error("Failed to fetch products");
  }

  return res.data ? { products: res.data.products, total: res.data.total, error: false } : { products: [], total: 0, error: true };
}


export default async function CollectionPage({ searchParams }: { searchParams: Promise<CollectionSearchParams> }) {

  const params= await searchParams;

  const productsPromise=getProducts(Promise.resolve(params));

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12 text-white">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <h1 className="text-3xl sm:text-4xl font-bold">
            Our Collection
          </h1>

          <Suspense fallback={<ControlsSkeleton />}>
            <ControlsServer dataPromise={productsPromise} />
          </Suspense>


        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-64"
                />
              ))}
            </div>
          }
        >
          <ProductGrid dataPromise={productsPromise} />
        </Suspense>

      </div>

    </div>
  );
}



function ControlsSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="h-10 w-40 bg-zinc-800 rounded-lg" />
      <div className="h-10 w-32 bg-zinc-800 rounded-lg" />
    </div>
  );
}
