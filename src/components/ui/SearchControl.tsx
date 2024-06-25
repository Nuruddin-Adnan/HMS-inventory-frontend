"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function SearchControl({
  placeholder = "search...",
}: {
  placeholder?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term.trim()) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="w-5 h-5 absolute left-1.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        className="text-base block w-full border border-gray-200 rounded text-textPrimary placeholder:text-textSecondary py-1 pl-8 pr-2"
      />
    </div>
  );
}
