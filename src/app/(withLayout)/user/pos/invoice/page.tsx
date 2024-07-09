import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import Invoice from "@/components/Invoice";
import React from "react";

export default async function InvoicePage() {
  const order = await getSingleOrder("24000030");

  return (
    <div>
      <Invoice order={order?.data} />
    </div>
  );
}
