import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllPermissions = async (query: string = "") => {
  const result = await fetchData(
    `permissions?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ['permission'] }
    },
    false
  );

  return result;
};
