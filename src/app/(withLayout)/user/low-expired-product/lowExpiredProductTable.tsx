"use client";

import { markAsSoldPurchase } from "@/api-services/purchase/markAsSoldPurchase";
import Button from "@/components/ui/button/Button";
import Table from "@/components/ui/table/Table";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import React from "react";
import Swal from "sweetalert2";

export default function LowExpiredProductTable({
  purchases,
  userRole,
}: {
  purchases: any[],
  userRole: any,
}) {

  const handleMarkAsRead = (rowKey: any) => {
    // Implement logic here
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Mark as sold!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await markAsSoldPurchase(rowKey);
        await tagRevalidate("purchase");
      }
    });
  };

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

  if (["super_admin", "admin", "store_incharge"].includes(userRole)) {
    columns.push({
      key: "action",
      label: "Action",
      render: (row: any) => {
        return (
          <Button
            variant="danger"
            onClick={() => handleMarkAsRead(row?.BILLID)}
            className="py-1.5"
          >
            Mark as sold
          </Button>
        );
      },
    });
  }

  return (
    <div>
      {/* Table component */}
      <Table
        columns={columns}
        data={purchases}
        uniqueKey="BILLID"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5 text-sm"
        tableStriped
        responsive
        sort
        tableHeightClass="h-[calc(100vh-185px)]"
        tableHover
      />
    </div>
  );
}
