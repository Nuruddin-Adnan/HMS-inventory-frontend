import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllStocks } from "@/api-services/stock/getAllStocks";
import { getAllCustomers } from "@/api-services/customer/getAllCustomers";
import POSForm from "./components/posForm";
import { getAllTaxs } from "@/api-services/tax/getAllTaxs";

export default async function CreateProduct() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const stocksPromise = getAllStocks("status=active&fields=product");
  const taxPromise = getAllTaxs(
    "status=active&purpose=vat&limit=1&fields=-createdBy -updatedBy"
  );

  const [stocks, tax] = await Promise.all([stocksPromise, taxPromise]);

  const productDataArray = stocks.data.map((stock: any) => stock.product[0]);

  return (
    <div>
      <POSForm productsList={productDataArray} tax={tax?.data[0]} />
    </div>
  );
}
