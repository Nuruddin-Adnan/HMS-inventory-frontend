import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createSupplier = async (payload: any) => {
  const result = await fetchData(`suppliers/create-supplier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};