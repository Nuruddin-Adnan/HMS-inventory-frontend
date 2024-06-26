import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllSuppliers = async (query: string = "") => {
  const result = await fetchData(
    `suppliers?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["supplier"] },
    },
    false
  );

  return result;
};
