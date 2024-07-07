"use client";

import { deleteProduct } from "@/api-services/product/deleteProduct";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductTable({ products }: { products: any[] }) {
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
    { key: "code", label: "Code" },
    { key: "tag", label: "Tag" },
    {
      key: "category",
      label: "Category",
      render: (row: any) => (
        <div className="capitalize">{row?.category[0]?.name}</div>
      ),
    },
    {
      key: "name",
      label: "Product Name",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.name}</div>
      ),
    },
    {
      key: "genericName",
      label: "Generic Name",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.genericName}</div>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.brand}</div>
      ),
    },
    {
      key: "shelve",
      label: "Shelve",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.shelve}</div>
      ),
    },
    { key: "unit", label: "Unit" },
    { key: "fullUnit", label: "Full Unit" },
    {
      key: "price",
      label: "Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.price}</div>
      ),
    },
    {
      key: "fullPrice",
      label: "Full Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.fullPrice}</div>
      ),
    },
    {
      key: "discountPercent",
      label: "Discount %",
      render: (row: any) => <div>{parseInt(row?.discountPercent)}</div>,
    },
    {
      key: "discountAmount",
      label: "Discount",
      render: (row: any) => <div>{parseInt(row?.discountAmount)}</div>,
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
    router.push(`/user/product/update/${rowKey}`);
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
        await deleteProduct(rowKey);
        await tagRevalidate("product");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        caption={
          <h2 className="hidden pt-3 print:block text-black text-xl font-bold underline">
            Products
          </h2>
        }
        columns={columns}
        data={products}
        uniqueKey="_id"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap"
        create={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? "/user/product/create"
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
        sort
        print
      />
    </div>
  );
}
