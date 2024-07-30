"use client";

import Table from "@/components/ui/table/Table";
import React from "react";

export default function MostSellingProductTable({ data }: { data: any[] }) {
  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row: any) => <div>{row?.productDetails?.name}</div>,
    },
    {
      key: "genericName",
      label: "Generic Name",
      render: (row: any) => <div>{row?.productDetails?.genericName}</div>,
    },
    {
      key: "brand",
      label: "Brand",
      render: (row: any) => <div className="text-nowrap">{row?.productDetails?.brand}</div>,
    },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.totalQuantity}</div>
      ),
    },
  ];

  return (
    <div>
      {/* Table component */}
      <Table
        columns={columns}
        data={data}
        uniqueKey="BILLID"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200 py-1.5"
        customTdClass="py-0.5 text-sm"
        responsive
        tableStriped
        sort
        tableHeightClass="max-h-[400px]"
        serialized
      />
    </div>
  );
}
