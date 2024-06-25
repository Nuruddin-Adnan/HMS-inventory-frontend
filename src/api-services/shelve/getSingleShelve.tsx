import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleShelve = async (id: string) => {
  const result = await fetchData(
    `shelves/${id}`,
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
