import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getMostSellingOrderItems = async () => {
  const result = await fetchData(
    `order-items/most-selling-items`,
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
