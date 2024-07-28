import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllExpenseCategories = async (query: string = "") => {
  const result = await fetchData(
    `expense-categories?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["expense-category"] },
    },
    false
  );

  return result;
};
