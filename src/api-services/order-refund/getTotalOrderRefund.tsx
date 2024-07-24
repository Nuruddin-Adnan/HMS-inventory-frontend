import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getTotalOrderRefund = async (query: string = "") => {
  const result = await fetchData(
    `order-refunds/get-total-refund?${query}`,
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
