"use client";

import { deleteGeneric } from "@/api-services/generic/deleteGeneric";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function GenericTable({ generics }: { generics: any[] }) {
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
    { key: "name", label: "Generic Name" },
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
    router.push(`/user/generic/update/${rowKey}`);
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
        await deleteGeneric(rowKey);
        await tagRevalidate("generic");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        // title="Generic"
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              Generic name
            </h2>
          </div>
        }
        columns={columns}
        data={generics}
        uniqueKey="_id"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        create={
          new Set(["super_admin", "admin"]).has(role) ? "/user/generic/create" : undefined
        }
        onEdit={handleEdit}
        onDelete={new Set(["super_admin"]).has(role) ? handleDelete : undefined}
        action={new Set(["super_admin", "admin"]).has(role) ? true : false}
        responsive
        tableHeightClass="h-[calc(100vh-170px)]"
        sort
        print
      />
    </div>
  );
}
