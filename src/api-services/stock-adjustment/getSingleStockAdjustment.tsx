import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleStockAdjustment = async (id: string) => {
  const result = await fetchData(
    `stock-adjustments/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
    },
    false
  );

  return result;
};
