import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import OrderRefundForm from "./orderRefundForm";

export default async function RefundOrder({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set([
    "super_admin",
    "admin",
    "store_incharge",
    "salesman",
  ]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const Order = await getSingleOrder(params.id);

  return (
    <div>
      <OrderRefundForm data={Order.data} />
    </div>
  );
}
