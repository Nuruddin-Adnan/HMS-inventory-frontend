
import React from "react";
import { getMostSellingOrderItems } from "@/api-services/order-item/getMostSellingOrderItems";
import MostSellingProductTable from "./MostSellingProductTable";

export default async function MostSellingProductPage() {
  const mostSellingProducts = await getMostSellingOrderItems();

  return (
    <MostSellingProductTable data={mostSellingProducts?.data} />
  );
}
