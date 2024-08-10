import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const markAsSoldPurchase = async (id: string) => {
  const result = await fetchData(`purchases/mark-as-sold/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
