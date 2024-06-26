import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteCustomer = async (id: string) => {
  const result = await fetchData(`customers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
