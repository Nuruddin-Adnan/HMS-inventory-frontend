import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createOrder = async (payload: any) => {
  const result = await fetchData(`orders/create-Order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
