import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const orderRefund = async (id: string, payload: any) => {
  // Refund from refund collection
  const result = await fetchData(`refunds/order-refund/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
