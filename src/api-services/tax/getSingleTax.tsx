import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleTax = async (id: string) => {
  const result = await fetchData(
    `taxs/${id}`,
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
