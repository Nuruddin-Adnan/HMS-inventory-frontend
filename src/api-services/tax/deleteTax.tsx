import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteTax = async (id: string) => {
  const result = await fetchData(`taxs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
