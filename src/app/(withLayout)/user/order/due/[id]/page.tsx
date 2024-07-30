import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import OrderDueForm from "./orderDueForm";

export default async function DueOrder({ params }: { params: { id: string } }) {
  const user = getUserServer();

  const allowedRoles = new Set([
    "super_admin",
    "admin",
    "store_incharge",
    "salesman"
  ]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const Order = await getSingleOrder(params.id);

  return (
    <div>
      <OrderDueForm data={Order.data} />
    </div>
  );
}
