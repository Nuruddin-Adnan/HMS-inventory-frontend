import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const duePaymentPurchase = async (id: string, payload: any) => {
  const result = await fetchData(`purchases/due-payment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};