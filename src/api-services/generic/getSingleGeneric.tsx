import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleGeneric = async (id: string) => {
  const result = await fetchData(
    `generics/${id}`,
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
