import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleUser = async (id: string) => {
  const result = await fetchData(
    `users/${id}`,
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
