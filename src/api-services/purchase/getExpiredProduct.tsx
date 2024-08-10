import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getExpiredProduct = async (query: string = "") => {
  const result = await fetchData(
    `purchases/expired-product?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["purchase"] },
    },
    false
  );

  return result;
};
