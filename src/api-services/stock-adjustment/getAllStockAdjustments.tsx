import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllStockAdjustments = async (query: string = "") => {
  const result = await fetchData(
    `stock-adjustments?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["stock-adjustment"] },
    },
    false
  );

  return result;
};
