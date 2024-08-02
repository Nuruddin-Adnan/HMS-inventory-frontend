import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createStockAdjustment = async (payload: any) => {
  const result = await fetchData(`stock-adjustments/create-stock-adjustment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
