import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const getSingleOrderClient = async (
  id: string,
  successNotify: boolean = false,
  errorNotify: boolean = true
) => {
  const result = await fetchData(
    `orders/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get("accessToken"),
      },
    },
    undefined, // notification false
    successNotify, //success notification false
    errorNotify
  );

  return result;
};