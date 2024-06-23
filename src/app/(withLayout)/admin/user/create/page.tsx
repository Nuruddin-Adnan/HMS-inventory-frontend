import React from "react";
import UserForm from "./userForm";
import { getAllPermissions } from "@/api-services/permission/getAllPermissions";

export default async function CreateUser() {
  const permissions = await getAllPermissions();

  // const { data: permissions } = await getAllPermissions();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mx-auto">
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
