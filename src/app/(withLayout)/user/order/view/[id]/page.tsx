import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getSingleOrder } from "@/api-services/order/getSingleOrder";
import ViewOrder from "./viewOrder";

export default async function UpdatePurchase({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge", "salesman", "account_admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const order = await getSingleOrder(params.id)


  return (
    <div>
      <ViewOrder data={order?.data} />
    </div>
  );
}
