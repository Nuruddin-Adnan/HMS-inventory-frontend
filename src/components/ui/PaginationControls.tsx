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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = searchParams.get("page") ?? "1";

  const start = (Number(currentPage) - 1) * Number(limit);
  const end = start + Number(limit);

  const hasPrevPage = start > 0;
  const hasNextPage = end < totalPages;

  return (
    <div className="flex items-center gap-2">
      <Button
        className={`py-1 px-2 bg-gray-200 border border-gray-300 ${
          !hasPrevPage && "text-gray-500"
        }`}
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(
            `${pathname}?page=${Number(currentPage) - 1}&limit=${limit}`
          );
        }}
      >
        <ChevronLeftIcon className="size-6" />
      </Button>

      <div>
        {currentPage} / {Math.ceil(totalPages / Number(limit))}
      </div>

      <Button
        className={`py-1 px-2 bg-gray-200 border border-gray-300 ${
          !hasNextPage && "text-gray-500"
        }`}
        disabled={!hasNextPage}
        onClick={() => {
          router.push(
            `${pathname}?page=${Number(currentPage) + 1}&limit=${limit}`
          );
        }}
      >
        <ChevronRightIcon className="size-6" />
      </Button>
      {/* <a href={!hasNextPage ? '#' : `${pathname}?page=${Number(currentPage) + 1}&limit=${limit}`}>next page</a> */}
    </div>
  );
};

export default PaginationControls;
