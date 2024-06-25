import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteShelve = async (id: string) => {
  const result = await fetchData(`shelves/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
