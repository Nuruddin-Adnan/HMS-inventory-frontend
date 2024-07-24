import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const totalPayment = async (query: string = "") => {
  const result = await fetchData(
    `payments/total-payment?${query}`,
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
