import { use } from "react";
import Controls from "./Controls";
import {GetProductsResult} from "@/types/products";

type Props = {
  dataPromise: Promise<GetProductsResult>;
};

export default function ControlsServer({ dataPromise }: Props) {

  const data = use(dataPromise);

  return <Controls total={data.total} />;
}
