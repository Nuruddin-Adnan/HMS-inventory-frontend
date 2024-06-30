import React from "react";
import UserForm from "./userForm";
import { getAllPermissions } from "@/api-services/permission/getAllPermissions";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function CreateUser() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const permissions = await getAllPermissions();

  return (
    <div>
      <div className="card mx-auto max-w-6xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create User
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <UserForm
            data={permissions?.data}
          />
        </div>
      </div>
    </div>
  );
}