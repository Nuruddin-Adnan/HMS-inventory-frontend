"use client";

import Table from "@/components/ui/table/Table";
import React from "react";

export default function LowStockTable({ stocks }: {
  stocks: any[],
}) {


  const columns = [
    {
      key: "product.code",
      label: "Code",
      // render: (row: any) => <div>{row?.product[0]?.code}</div>,
    },
    { key: "productName", label: "Product Name" },
    {
      key: "product.unit",
      label: "Unit",
      // render: (row: any) => <div>{row?.product[0]?.unit}</div>,
    },
    {
      key: "price",
      label: "Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.product?.price}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4 text-red-500">{row?.quantity}</div>
      ),
    },
    {
      key: "alertQuantity",
      label: "Alert",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.alertQuantity}</div>
      ),
    },
  ];

  return (
    <div>
      {/* Table component */}
      <Table
        columns={columns}
        data={stocks}
        uniqueKey="_id"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5 align-top print:py-0"
        responsive
        tableStriped
        sort
        // print
        // search
        tableHeightClass="max-h-[300px]"
      />
    </div>
  );
}
