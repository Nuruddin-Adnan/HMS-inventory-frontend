"use client";

import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PurchaseTable({ purchases }: { purchases: any[] }) {
  const [role, updateRole] = useState("");
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        updateRole(user.role);
      }
    }
  }, [user]);

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (row: any) => <div>{row?.product[0]?.code}</div>,
    },
    { key: "productName", label: "Product Name" },
    {
      key: "unit",
      label: "Unit",
      render: (row: any) => <div>{row?.product[0]?.unit}</div>,
    },
    {
      key: "price",
      label: "Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.product[0]?.price}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.quantity}</div>
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
    {
      key: "totalSell",
      label: "Total Sell",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.totalSell}</div>
      ),
    },
    {
      key: "createdAt",
      label: "Entry On",
      customClass: "pl-8",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      customClass: "text-center",
      render: (row: any) => (
        <div
          className={
            row.status === "active"
              ? "bg-[#28A745] bg-opacity-[.12] text-[#28A745] font-medium rounded-full text-center m-auto w-20"
              : "bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] font-medium rounded-full text-center m-auto w-20 !py-0"
          }
        >
          {row?.status}
        </div>
      ),
    },
  ];

  const handleEdit = (rowKey: any) => {
    // Implement edit logic here
    router.push(`/user/purchase/update/${rowKey}`);
  };

  return (
    <div>
      {/* Table component */}
      <Table
        caption={
          <h2 className="hidden pt-3 print:block text-black text-xl font-bold underline">
            purchases
          </h2>
        }
        columns={columns}
        data={purchases}
        uniqueKey="_id"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap"
        create={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? "/user/purchase/create"
            : undefined
        }
        onEdit={handleEdit}
        action={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? true
            : false
        }
        responsive
        sort
        print
      />
    </div>
  );
}
