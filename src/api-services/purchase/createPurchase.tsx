import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createPurchase = async (payload: any) => {
  const result = await fetchData(`purchases/create-purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
