import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllStocks } from "@/api-services/stock/getAllStocks";
import POSForm from "./components/posForm";
import { getAllTaxs } from "@/api-services/tax/getAllTaxs";
import { getAllPermissions } from "@/api-services/permission/getAllPermissions";

export default async function CreateProduct() {
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

  const stocksPromise = getAllStocks("status=active&fields=product");
  const taxPromise = getAllTaxs(
    "status=active&purpose=vat&limit=1&fields=-createdBy -updatedBy"
  );
  const permissionsPromise = getAllPermissions(
    "sort=-createdAt&fields=_id, name"
  );

  const [stocks, tax, permissions] = await Promise.all([
    stocksPromise,
    taxPromise,
    permissionsPromise,
  ]);

  const productDataArray = stocks.data.map((stock: any) => stock.product[0]);

  return (
    <div>
      <POSForm
        productsList={productDataArray}
        tax={tax?.data[0]}
        permissions={permissions?.data}
        user={user}
      />
    </div>
  );
}
