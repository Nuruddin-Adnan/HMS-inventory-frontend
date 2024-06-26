import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import SupplierUpdateForm from "./supplierUpdateForm";
import { getSingleSupplier } from "@/api-services/supplier/getSingleSupplier";
import { getAllBrands } from "@/api-services/brand/getAllBrands";

export default async function UpdateSupplier({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set([
    "super_admin",
    "admin",
    "store_incharge",
  ]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const supplierPromise = getSingleSupplier(params.id);
  const brandsPromise = getAllBrands("status=active&fields=name _id");

  const [supplier, brands] = await Promise.all([supplierPromise, brandsPromise])

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Supplier
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <SupplierUpdateForm data={supplier.data} brands={brands.data} />
        </div>
      </div>
    </div>
  );
}
