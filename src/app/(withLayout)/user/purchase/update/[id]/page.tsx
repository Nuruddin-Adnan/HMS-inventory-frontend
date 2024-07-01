import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import StockUpdateForm from "./stockUpdateForm";
import { getAllProducts } from "@/api-services/product/getAllProducts";
import { getSingleStock } from "@/api-services/stock/getSingleStock";

export default async function UpdateStock({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const Stock = await getSingleStock(params.id);
  const products = await getAllProducts("status=active&fields=name _id");

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Stock
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <StockUpdateForm data={Stock.data} products={products?.data} />
        </div>
      </div>
    </div>
  );
}
