import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllPurchases = async (query: string = "") => {
  const result = await fetchData(
    `purchases?${query}`,
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