import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllStocks = async (query: string = "") => {
  const result = await fetchData(
    `stocks?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["stock"] },
    },
    false
  );

  return result;
};
