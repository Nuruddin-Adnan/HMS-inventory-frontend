import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllProducts } from "@/api-services/product/getAllProducts";
import StockCreateForm from "./stockCreateForm";

export default async function CreateStock() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const products = await getAllProducts("status=active&fields=name brand _id");

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create Stock
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <StockCreateForm products={products?.data} />
        </div>
      </div>
    </div>
  );
}
