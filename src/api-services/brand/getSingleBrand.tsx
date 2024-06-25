import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleBrand = async (id: string) => {
  const result = await fetchData(
    `brands/${id}`,
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
