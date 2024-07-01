import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const refundPurchase = async (id: string, payload: any) => {
  const result = await fetchData(`purchases/refund/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
