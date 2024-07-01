"use client";

import { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "./button/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationControlsProps {
  totalPages: number;
  limit: number;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  totalPages,
  limit,
}) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = searchParams.get("page") ?? "1";

  const start = (Number(currentPage) - 1) * Number(limit);
  const end = start + Number(limit);

  const hasPrevPage = start > 0;
  const hasNextPage = end < totalPages;

  const createPageURL = (oparator: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (oparator) {
      params.set('page', (Number(currentPage) + 1) as unknown as string);
    } else {
      params.set('page', (Number(currentPage) - 1) as unknown as string);
    }
    params.set('limit', limit as unknown as string)
    replace(`${pathname}?${params.toString()}`);
  };


  return (
    <div className="flex items-center gap-2">
      <Button
        className={`py-1 px-2 bg-gray-200 border border-gray-300 ${!hasPrevPage && "text-gray-500"
          }`}
        disabled={!hasPrevPage}
        onClick={() => createPageURL(false)}
      >
        <ChevronLeftIcon className="size-6" />
      </Button>

      <div>
        {currentPage} / {Math.ceil(totalPages / Number(limit))}
      </div>

      <Button
        className={`py-1 px-2 bg-gray-200 border border-gray-300 ${!hasNextPage && "text-gray-500"
          }`}
        disabled={!hasNextPage}
        onClick={() => createPageURL(true)}
      >
        <ChevronRightIcon className="size-6" />
      </Button>
    </div>
  );
};

export default PaginationControls;
