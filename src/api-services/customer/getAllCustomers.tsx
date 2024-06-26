import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllCustomers = async (query: string = "") => {
  const result = await fetchData(
    `customers?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["customer"] },
    },
    false
  );

  return result;
};
