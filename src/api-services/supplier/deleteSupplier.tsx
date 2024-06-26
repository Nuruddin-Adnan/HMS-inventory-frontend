import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteSupplier = async (id: string) => {
  const result = await fetchData(`suppliers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
