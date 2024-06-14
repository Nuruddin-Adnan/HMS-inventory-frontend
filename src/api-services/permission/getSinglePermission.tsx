import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSinglePermission = async (id: string) => {
  const result = await fetchData(
    `permissions/${id}`,
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
