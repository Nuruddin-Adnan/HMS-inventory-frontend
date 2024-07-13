import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import Invoice from "@/components/Invoice";
import InvoiceLg from "@/components/InvoiceLg";
import React from "react";

export default async function InvoicePage() {
  const order = await getSingleOrder("24000030");

  return (
    <div className="max-w-4xl mx-auto">
      <Invoice order={order?.data} />
    </div>
  );
}
