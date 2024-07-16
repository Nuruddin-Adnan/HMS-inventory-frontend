import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllRefunds = async (query: string = "") => {
  const result = await fetchData(
    `refunds?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["refund"] },
    },
    false
  );

  return result;
};
