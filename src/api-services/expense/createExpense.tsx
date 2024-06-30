import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createExpense = async (payload: any) => {
  const result = await fetchData(`expenses/create-expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
