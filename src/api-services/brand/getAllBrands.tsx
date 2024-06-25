import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllBrands = async (query: string = "") => {
  const result = await fetchData(
    `brands?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["brand"] },
    },
    false
  );

  return result;
};
