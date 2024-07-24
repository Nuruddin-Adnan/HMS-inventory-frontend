import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllOrderItems = async (query: string = "") => {
  const result = await fetchData(
    `order-items?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["order-item"] },
    },
    false
  );

  return result;
};
