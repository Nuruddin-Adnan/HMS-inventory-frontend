import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllStocks } from "@/api-services/stock/getAllStocks";
import StockAdjustmentCreateForm from "./stockAdjustmentCreateForm";

export default async function CreateStockAdjustment() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const products = await getAllStocks("status=active&fields=product.name product.brand product.unit product.price product._id quantity");

  return (
    <div>
      <div className="card mx-auto max-w-5xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create Damage/Expire
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <StockAdjustmentCreateForm products={products?.data} />
        </div>
      </div>
    </div>
  );
}
