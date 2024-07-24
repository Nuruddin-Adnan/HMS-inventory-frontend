"use client";

import { deleteStock } from "@/api-services/stock/deleteStock";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function StockTable({ stocks }: { stocks: any[] }) {
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
    router.push(`/user/stock/update/${rowKey}`);
  };

  const handleDelete = (rowKey: any) => {
    // Implement delete logic here
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteStock(rowKey);
        await tagRevalidate("stock");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              Stocks
            </h2>
          </div>
        }
        columns={columns}
        data={stocks}
        uniqueKey="_id"
        customTrClass={(row: any) => row.quantity <= row.alertQuantity ? 'bg-red-200 text-red-700' : ''}
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5"
        create={
          new Set(["super_admin", "admin"]).has(role)
            ? "/user/stock/create"
            : undefined
        }
        onEdit={handleEdit}
        onDelete={new Set(["super_admin"]).has(role) ? handleDelete : undefined}
        action={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? true
            : false
        }
        responsive
        tableStriped
        sort
        print
        tableHeightClass="h-[calc(100vh-170px)]"
      />
    </div>
  );
}
