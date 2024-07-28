import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createExpenseCategory = async (payload: any) => {
  const result = await fetchData(`expense-categories/create-expense-category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
