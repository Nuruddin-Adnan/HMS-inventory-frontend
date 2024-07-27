import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getLowStocks = async (query: string = "") => {
  const result = await fetchData(
    `stocks/get-low-stock?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["low-stock"] },
    },
    false
  );

  return result;
};
