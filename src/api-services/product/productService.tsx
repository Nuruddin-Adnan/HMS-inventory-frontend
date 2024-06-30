import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

const createProduct = async (payload: any) => {
  const result = await fetchData(`products/create-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await fetchData(`products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });
  return result;
};

const getAllProducts = async (query: string = "") => {
  const result = await fetchData(
    `products?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get("accessToken"),
      },
      next: { revalidate: 60, tags: ["product"] },
    },
    false
  );
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await fetchData(
    `products/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get("accessToken"),
      },
    },
    false
  );

  return result;
};

const updateProduct = async (id: string, payload: any) => {
  const result = await fetchData(`products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
