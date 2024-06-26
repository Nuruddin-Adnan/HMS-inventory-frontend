import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createCustomer = async (payload: any) => {
  const result = await fetchData(`customers/create-customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
