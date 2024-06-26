import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllProducts = async (query: string = "") => {
  const result = await fetchData(
    `products?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["product"] },
    },
    false
  );

  return result;
};
