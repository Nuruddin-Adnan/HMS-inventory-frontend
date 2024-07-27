import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getSingleShelve } from "@/api-services/shelve/getSingleShelve";
import ShelveUpdateForm from "./shelveUpdateForm";

export default async function UpdateShelve({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const { data } = await getSingleShelve(params.id);

  return (
    <div>
      <div className="card mx-auto max-w-5xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Shelve
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <ShelveUpdateForm data={data} />
        </div>
      </div>
    </div>
  );
}
