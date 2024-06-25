import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllShelves = async (query: string = "") => {
  const result = await fetchData(
    `shelves?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["shelve"] },
    },
    false
  );

  return result;
};
