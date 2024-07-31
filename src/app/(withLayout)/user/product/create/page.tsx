import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import ProductCreateForm from "./productCreateForm";
import { getAllBrands } from "@/api-services/brand/getAllBrands";
import { getAllCategories } from "@/api-services/category/getAllCategories";
import { getAllGenerics } from "@/api-services/generic/getAllGenerics";

export default async function CreateProduct() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const categoriesPromise = getAllCategories("status=active&fields=name _id");
  const brandsPromise = getAllBrands("status=active&fields=name");
  const genericsPromise = getAllGenerics("status=active&fields=name");

  const [categories, brands, generics] = await Promise.all([
    categoriesPromise,
    brandsPromise,
    genericsPromise,
  ]);

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3 flex justify-between items-baseline">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create Product
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <ProductCreateForm
            categories={categories?.data}
            brands={brands?.data}
            generics={generics?.data}
          />
        </div>
      </div>
    </div>
  );
}
