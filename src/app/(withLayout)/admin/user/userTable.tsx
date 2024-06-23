/* eslint-disable @next/next/no-img-element */
"use client";

import { deleteUser } from "@/api-services/user/deleteUser";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { IUser } from "@/types/uesr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function UserTable({ users }: { users: IUser[] }) {
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
    { key: "name", label: "Name" },
    { key: "email", label: "Email/user name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "role", label: "Role" },
    {
      key: "permission",
      label: "Permission",
      render: (row: any) => (
        <div>
          {row?.permission &&
            row?.permission.map((item: any) => (
              <p className="leading-tight whitespace-nowrap" key={item?._id}>
                {item?.name}
              </p>
            ))}
        </div>
      ),
    },
    {
      key: "signature",
      label: "Signature",
      render: (row: any) =>
        row?.signature && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${row?.signature}`}
            alt="signature"
            className="max-w-28"
          />
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <div
          className={
            row.status === "active"
              ? "bg-[#28A745] bg-opacity-[.12] text-[#28A745] font-medium rounded-full text-center w-20"
              : "bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] font-medium rounded-full text-center w-20 !py-0"
          }
        >
          {row?.status}
        </div>
      ),
    },
  ];

  const handleEdit = (rowKey: any) => {
    // Implement edit logic here
    router.push(`/admin/user/update/${rowKey}`);
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
        await deleteUser(rowKey);
        await tagRevalidate("user");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        title="User"
        columns={columns}
        data={users}
        uniqueKey="_id" // need for perform action like view/edit/delete or sort
        // customTableClass="border border-gray-300"
        // customThClass="text-right"
        customTdClass="align-top pb-0"
        // tableHover
        // tableStriped
        customTfClass="text-right whitespace-nowrap"
        create="/admin/user/create"
        onEdit={handleEdit}
        onDelete={role === "super_admin" ? handleDelete : undefined}
        action={true}
        responsive
        search
        sort
        print
        serialized
      />
    </div>
  );
}
