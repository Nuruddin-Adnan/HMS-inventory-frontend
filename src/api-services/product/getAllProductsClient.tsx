import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const getAllProductsClient = async (
  query: string = "",
  successNotify: boolean = false,
  errorNotify: boolean = true
) => {
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
    undefined, // notification false
    successNotify, //success notification false
    errorNotify
  );

  return result;
};
