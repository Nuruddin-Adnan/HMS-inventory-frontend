import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllOrderRefunds = async (query: string = "") => {
  const result = await fetchData(
    `order-refunds?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["order-refund"] },
    },
    false
  );

  return result;
};
