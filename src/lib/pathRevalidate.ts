"use server";

import { revalidatePath } from "next/cache";

export default async function pathRevalidate(
  path: string,
  type?: "page" | "layout"
) {
  return revalidatePath(path, type);
}
