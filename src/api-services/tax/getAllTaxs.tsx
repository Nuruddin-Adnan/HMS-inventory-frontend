import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllTaxs = async (query: string = "") => {
  const result = await fetchData(
    `taxs?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["tax"] },
    },
    false
  );

  return result;
};
