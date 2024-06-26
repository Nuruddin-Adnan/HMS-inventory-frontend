import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import SupplierCreateForm from "./supplierCreateForm";
import { getAllBrands } from "@/api-services/brand/getAllBrands";

export default async function CreateSupplier() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const { data: brands } = await getAllBrands("status=active&fields=name _id");

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create supplier
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <SupplierCreateForm brands={brands} />
        </div>
      </div>
    </div>
  );
}
