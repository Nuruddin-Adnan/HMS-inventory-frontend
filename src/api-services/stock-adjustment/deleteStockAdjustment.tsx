import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const deleteStockAdjustment = async (id: string) => {
  const result = await fetchData(`stock-adjustments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
  });

  return result;
};
