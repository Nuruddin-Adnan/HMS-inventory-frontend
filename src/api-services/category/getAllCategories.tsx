import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllCategories = async (query: string = "") => {
  const result = await fetchData(
    `categories?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["category"] },
    },
    false
  );

  return result;
};
