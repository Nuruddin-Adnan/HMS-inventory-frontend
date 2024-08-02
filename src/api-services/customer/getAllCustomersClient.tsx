import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const getAllCustomersClient = async (
  query: string = "",
  successNotify: boolean = false,
  errorNotify: boolean = true
) => {
  const result = await fetchData(
    `customers?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get("accessToken"),
      },
      next: { revalidate: 60, tags: ["customer"] },
    },
    undefined, // notification false
    successNotify, //success notification false
    errorNotify
  );

  return result;
};
