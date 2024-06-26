import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleCustomer = async (id: string) => {
  const result = await fetchData(
    `customers/${id}`,
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
