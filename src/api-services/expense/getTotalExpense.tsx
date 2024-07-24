import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getTotalExpense = async (query: string = "") => {
  const result = await fetchData(
    `expenses/get-total-expense?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["expense"] },
    },
    false
  );

  return result;
};
