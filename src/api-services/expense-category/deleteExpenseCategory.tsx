import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteExpenseCategory = async (id: string) => {
  const result = await fetchData(`expense-categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
