import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllBrands } from "@/api-services/brand/getAllBrands";
import { getSingleProduct } from "@/api-services/product/getSingleProduct";
import { getAllCategories } from "@/api-services/category/getAllCategories";
import { getAllGenerics } from "@/api-services/generic/getAllGenerics";
import { getAllShelves } from "@/api-services/shelve/getAllShelves";
import ProductUpdateForm from "./productUpdateForm";

export default async function UpdateProduct({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set([
    "super_admin",
    "admin",
    "store_incharge",
  ]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const productPromise = getSingleProduct(params.id);
  const categoriesPromise = getAllCategories("status=active&fields=name _id");
  const brandsPromise = getAllBrands("status=active&fields=name");
  const genericsPromise = getAllGenerics("status=active&fields=name");
  const shelvesPromise = getAllShelves("status=active&fields=name _id");

  const [product, categories, brands, generics, shelves] = await Promise.all([productPromise, categoriesPromise, brandsPromise, genericsPromise, shelvesPromise])

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Product
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <ProductUpdateForm data={product.data} categories={categories?.data} brands={brands?.data} generics={generics?.data} shelves={shelves?.data} />
        </div>
      </div>
    </div>
  );
}
