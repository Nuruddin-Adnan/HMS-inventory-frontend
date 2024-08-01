"use client";

import Table from "@/components/ui/table/Table";
import React from "react";

export default function LowStockTable({ stocks, totalPages,
  limit }: {
    stocks: any[], totalPages: number;
    limit: number
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
        title={<h1 className="text-red-500">Low Stock Products</h1>}
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              Medinova Pharmacy
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              Low Stock Products
            </h2>
          </div>
        }
        columns={columns}
        data={stocks}
        uniqueKey="_id"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5 align-top print:py-0"
        responsive
        tableStriped
        sort
        print
        search
        tableHeightClass="h-[calc(100vh-176px)]"
        pagination
        totalPages={totalPages}
        limit={limit}
      />
    </div>
  );
}
