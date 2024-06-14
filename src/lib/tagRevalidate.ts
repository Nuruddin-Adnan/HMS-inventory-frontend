"use server";

import { revalidateTag } from "next/cache";

export default async function tagRevalidate(tagname: string) {
  return revalidateTag(tagname);
}
