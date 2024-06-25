import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteGeneric = async (id: string) => {
  const result = await fetchData(`generics/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
