import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getOrderSummary = async (query: string = "") => {
  const result = await fetchData(
    `orders/order-summary?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["order"] },
    },
    false
  );

  return result;
};
