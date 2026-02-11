import HomeClient from "@/components/HomeClient";
// import { Suspense } from "react";
// import HomeSkeleton from "@/components/HomeSkeleton";

export default async function HomePage() {
  return (
    <>
      {/* <Suspense fallback={<HomeSkeleton />}> */}
        <HomeClient />
      {/* </Suspense>   */}
    </>
  );
}
