"use client";

import { deleteShelve } from "@/api-services/shelve/deletePermission";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ShelveTable({ shelves }: { shelves: any[] }) {
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
    { key: "name", label: "Shelve Name" },
    { key: "description", label: "Items Description", render: (rows: any) => <div className="whitespace-pre-line">{rows?.description}</div> },
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
    router.push(`/user/shelve/update/${rowKey}`);
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
        await deleteShelve(rowKey);
        await tagRevalidate("shelve");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        // title="Shelves"
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              Shelves
            </h2>
          </div>
        }
        columns={columns}
        data={shelves}
        uniqueKey="_id"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="align-top"
        customTfClass="text-right whitespace-nowrap"
        create={
          new Set(["super_admin", "admin", "store_incharge"]).has(role) ? "/user/shelve/create" : undefined
        }
        onEdit={handleEdit}
        onDelete={new Set(["super_admin"]).has(role) ? handleDelete : undefined}
        action={new Set(["super_admin", "admin", "store_incharge"]).has(role) ? true : false}
        responsive
        tableHeightClass="h-[calc(100vh-170px)]"
        sort
        print
        serialized
      />
    </div>
  );
}
