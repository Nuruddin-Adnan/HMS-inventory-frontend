import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleRefund = async (id: string) => {
  const result = await fetchData(
    `refunds/${id}`,
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
