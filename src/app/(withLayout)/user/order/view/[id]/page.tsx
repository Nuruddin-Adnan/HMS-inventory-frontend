import React from "react";
import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import ViewOrder from "./viewOrder";

export default async function UpdatePurchase({
  params,
}: {
  params: { id: string };
}) {
  const order = await getSingleOrder(params.id)


  return (
    <div>
      <ViewOrder data={order?.data} />
    </div>
  );
}
