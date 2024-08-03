"use client";

import { deleteStockAdjustment } from "@/api-services/stock-adjustment/deleteStockAdjustment";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function StockAdjustmentTable({ stockAdjusments }: { stockAdjusments: any[] }) {
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
    { key: "productName", label: "Product Name" },
    {
      key: "brand", label: "Brand", render: (row: any) => <div>{row?.product?.brand}</div>,
    },
    {
      key: "unit",
      label: "Unit",
    },
    {
      key: "price",
      label: "Unit Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.price}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.quantity}</div>
      ),
    },
    {
      key: "causes",
      label: "Causes",
      render: (row: any) => <div className="capitalize">{row?.causes}</div>,
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
      key: "updatedAt",
      label: "Edited",
      render: (row: any) => {
        return <span className="whitespace-nowrap">
          {row.updatedBy && format(new Date(row?.updatedAt), 'dd/MMM/yyyy p')}
          <br />
          {row.updatedBy && <span> By: {row.updatedBy?.name}</span>}
        </span>
      }
    },
  ];

  const handleEdit = (rowKey: any) => {
    // Implement edit logic here
    router.push(`/user/damage-expire/update/${rowKey}`);
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
        await deleteStockAdjustment(rowKey);
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
              Damage, Expired & Lost
            </h2>
          </div>
        }
        columns={columns}
        data={stockAdjusments}
        uniqueKey="_id"
        customTrClass={(row: any) => row.quantity <= row.alertQuantity ? 'bg-red-200 text-red-700' : ''}
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5"
        create={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? "/user/damage-expire/create"
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
