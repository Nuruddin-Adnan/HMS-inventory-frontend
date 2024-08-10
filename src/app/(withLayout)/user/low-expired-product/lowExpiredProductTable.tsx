"use client";

import Table from "@/components/ui/table/Table";
import { format } from "date-fns";
import React from "react";

export default function LowExpiredProductTable({
  purchases,
  isExpired
}: {
  purchases: any[],
  isExpired: any;
}) {


  const columns = [
    {
      key: "createdAt",
      label: "Entry On",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "productName",
      label: "Product Name",
      render: (row: any) => (
        <div className="whitespace-nowrap">
          {row?.productName} <br />
          Code: {row?.product?.code}
        </div>
      ),
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (row: any) => (
        <div className="whitespace-nowrap">
          <span className="block">
            {" "}
            {row?.supplier?.name} ({row?.supplier?.contactNo})
          </span>
          <span className="block">{row?.supplier?.brand?.name}</span>
        </div>
      ),
    },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "lotNo", label: "Lot No" },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.expiryDate), "dd/MM/yyyy")}
          </span>
        );
      },
    },
    {
      key: "quantity",
      label: "Qty",
      render: (row: any) => {
        return (
          <span className="text-green-500 font-bold"> {row?.quantity} </span>
        );
      },
    },
    {
      key: "soldQuantity",
      label: "Sold",
      render: (row: any) => {
        return (
          <span className="text-red-500 font-bold"> {row?.soldQuantity} </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Table component */}
      <Table
        title={<span className="text-red-500">{isExpired ? 'Date expired product' : 'Low date expired product'}</span>}
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              {isExpired ? 'Date expired product' : 'Low date expired product'}
            </h2>
          </div>
        }
        columns={columns}
        data={purchases}
        uniqueKey="BILLID"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5 text-sm"
        tableStriped
        responsive
        sort
        tableHeightClass="h-[calc(100vh-170px)]"
      />
    </div>
  );
}
