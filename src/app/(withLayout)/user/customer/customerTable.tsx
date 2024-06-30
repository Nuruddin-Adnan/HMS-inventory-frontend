"use client";

import { deleteCustomer } from "@/api-services/customer/deleteCustomer";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CustomerTable({ customers }: { customers: any[] }) {
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
    { key: "CUSID", label: "ID" },
    { key: "name", label: "Customer Name", customClass: "whitespace-nowrap" },
    { key: "age", label: "Age" },
    {
      key: "gender",
      label: "Gender",
      render: (row: any) => <div className="capitalize">{row?.gender}</div>,
    },
    { key: "contactNo", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "points", label: "Points" },
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
    router.push(`/user/customer/update/${rowKey}`);
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
        await deleteCustomer(rowKey);
        await tagRevalidate("customer");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        // title="Customer"
        caption={
          <h2 className="hidden pt-3 print:block text-black text-xl font-bold underline">
            Customer
          </h2>
        }
        columns={columns}
        data={customers}
        uniqueKey="_id"
        customTfClass="text-right whitespace-nowrap"
        create={"/user/customer/create"}
        onEdit={handleEdit}
        onDelete={new Set(["super_admin"]).has(role) ? handleDelete : undefined}
        action={true}
        responsive
        // search
        sort
        print
      />
    </div>
  );
}
