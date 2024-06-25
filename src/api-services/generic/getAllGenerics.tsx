import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getAllGenerics = async (query: string = "") => {
  const result = await fetchData(
    `generics?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["generic"] },
    },
    false
  );

  return result;
};
