import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteCategory = async (id: string) => {
  const result = await fetchData(`categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
