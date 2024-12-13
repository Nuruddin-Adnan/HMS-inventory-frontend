import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const getAllStocksClient = async (
  query: string = "",
  successNotify: boolean = false,
  errorNotify: boolean = true
) => {
  const result = await fetchData(
    `stocks?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get("accessToken"),
      },
      next: { revalidate: 60, tags: ["stock"] },
    },
    undefined, // notification false
    successNotify, //success notification false
    errorNotify
  );

  return result;
};
