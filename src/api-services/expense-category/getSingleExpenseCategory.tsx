import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getSingleExpenseCategory = async (id: string) => {
  const result = await fetchData(
    `expense-categories/${id}`,
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
