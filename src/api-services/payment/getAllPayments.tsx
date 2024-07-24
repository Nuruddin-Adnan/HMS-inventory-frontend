import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllPayments = async (query: string = "") => {
  const result = await fetchData(
    `payments?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["payment"] },
    },
    false
  );

  return result;
};
