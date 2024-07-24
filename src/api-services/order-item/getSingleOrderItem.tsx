import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleOrderItem = async (id: string) => {
  const result = await fetchData(
    `order-items/${id}`,
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
