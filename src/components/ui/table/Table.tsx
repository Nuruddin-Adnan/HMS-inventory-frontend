"use client";

import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "../button/Button";
import {
  PlusIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { format } from "date-fns";
import { getUser } from "@/lib/getUser";
import cn from "@/lib/cn";
import "core-js";
import { useRouter } from "next/navigation";
import PaginationControls from "../PaginationControls";

export default function Table({
  title,
  caption,
  columns,
  data: initialData,
  uniqueKey,
  customTableClass,
  customTrClass,
  customThClass,
  customTdClass,
  customTfClass,
  tableHeightClass,
  tableStriped = false,
  tableHover = false,
  create = undefined,
  onView = undefined,
  onEdit = undefined,
  onDelete = undefined,
  backBtn = undefined,
  action = false,
  responsive = false,
  search = false,
  searchAutoFocus = false,
  print = false,
  sort = false,
  serialized = false,
  sumFields = [],
  sumFieldsFixed = 0,
  pageStyle = "",
  pagination = false,
  totalPages = 0,
  limit = 100
}: {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  columns: any[];
  data: any[];
  uniqueKey: any;
  customTableClass?: string;
  customTrClass?: any;
  customThClass?: string;
  customTdClass?: string;
  customTfClass?: string;
  tableHeightClass?: string;
  tableStriped?: boolean;
  tableHover?: boolean;
  create?: string;
  onView?: any;
  onEdit?: any;
  onDelete?: any;
  backBtn?: any;
  action?: boolean;
  responsive?: boolean;
  search?: boolean;
  searchAutoFocus?: boolean;
  print?: boolean;
  sort?: boolean;
  serialized?: boolean;
  sumFields?: any[];
  sumFieldsFixed?: number;
  pageStyle?: string;
  pagination?: boolean;
  totalPages?: number;
  limit?: number;
}) {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("ascending");

  const router = useRouter()

  const user = getUser();

  useEffect(() => {
    // Set the new recieved data
    setData(initialData);
  }, [initialData]);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });

  function renderNestedCell(row: any, key: any) {
    const nestedValue = key.split(".").reduce((acc: any, currentKey: any) => {
      if (acc && acc[currentKey] !== undefined) {
        return acc[currentKey];
      }
      return "";
    }, row);

    return typeof nestedValue === "object"
      ? JSON.stringify(nestedValue)
      : nestedValue;
  }

  const compareValues = (a: any, b: any) => {
    return typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
      });
  };

  const handleSort = (key: any) => {
    if (!sort) {
      // Sorting is not enabled, do nothing
      return;
    }

    setSortKey(key);
    setSortDirection((prevDirection) =>
      prevDirection === "ascending" ? "descending" : "ascending"
    );

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        const valueA = getNestedValue(a, key);
        const valueB = getNestedValue(b, key);

        return sortDirection === "ascending"
          ? compareValues(valueA, valueB)
          : compareValues(valueB, valueA);
      })
    );
  };

  const getNestedValue = (obj: any, key: any) => {
    return key.split(".").reduce((acc: any, currentKey: any) => {
      return acc && acc[currentKey] !== undefined ? acc[currentKey] : null;
    }, obj);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the data based on the search term
    const filteredData = initialData.filter((row) => {
      return Object.keys(row).some((key) => {
        const value = row[key];
        if (typeof value === "object" && value !== null) {
          // If the property is an object, recursively search its properties
          return searchNestedObject(value, term);
        } else {
          // Otherwise, perform a regular case-insensitive search
          return String(value).toLowerCase().includes(term);
        }
      });
    });

    setData(filteredData);
  };

  const searchNestedObject = (obj: any, term: string): boolean => {
    return Object.keys(obj).some((key) => {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        // If the property is an object, recursively search its properties
        return searchNestedObject(value, term);
      } else {
        // Otherwise, perform a regular case-insensitive search
        return String(value).toLowerCase().includes(term);
      }
    });
  };

  const calculateColumnSum = (key: any) => {
    if (!key) {
      return 0;
    }

    return data.reduce((sum, row) => {
      const keys = key.split(".");
      const nestedValue = keys.reduce((acc: any, currentKey: any) => {
        return acc && acc[currentKey] !== undefined ? acc[currentKey] : null;
      }, row);

      return sum + (nestedValue || 0);
    }, 0);
  };

  const getSumResults: any = () => {
    const sumResults: any = {};
    sumFields.forEach((field) => {
      sumResults[field] = calculateColumnSum(field);
    });
    return sumResults;
  };

  return (
    <>
      {(title || search || print || create || backBtn) && (
        <div className="sm:flex items-center justify-between border-b border-gray-200 2xl:p-4 p-3">
          {title && (
            <h2 className="font-bold 2xl:text-2xl text-lg text-textPrimary sm:py-2 py-2">
              {title}
            </h2>
          )}
          <div className="flex space-x-2">
            {search && (
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-1.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="text-base block w-full border border-gray-200 rounded text-textPrimary placeholder:text-textSecondary py-1.5 pl-8 pr-2"
                  autoFocus={searchAutoFocus}
                />
              </div>
            )}
            {pagination && (
              <PaginationControls totalPages={totalPages} limit={limit} btnClass="py-1.5" />
            )}
            {print && (
              <Button
                variant="primary-light"
                className="py-1.5 px-2 border-transparent"
                onClick={handlePrint}
              >
                <PrinterIcon className="h-5 w-5" />
              </Button>
            )}
            {create && (
              <Link
                href={create}
                className="bg-primary text-white flex items-center py-1.5 sm:px-4 px-2 rounded font-medium"
              >
                <PlusIcon className="h-5 w-5 sm:mr-2" /> <span className="sm:inline-block hidden">Create</span>
              </Link>
            )}
            {backBtn && (
              <Button
                variant="danger"
                className="py-1.5 px-2 border-transparent"
                onClick={() => router.back()}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Table  */}
      <div ref={componentRef}>
        <div className="print:p-5">
          <div
            className={
              responsive
                ? cn(
                  "w-full relative overflow-x-auto print:overflow-visible print:px-4 print:pb-4", tableHeightClass
                )
                : tableHeightClass
            }
          >
            <table className={cn("w-full", customTableClass)}>
              <caption>{caption}</caption>
              <thead className="sticky print:static top-0 bg-white z-[990]">
                <tr>
                  {serialized && (
                    <th
                      className={cn(
                        `max-w-max text-center py-1 px-2 text-textPrimary border-b border-gray-200 print:border-gray-700 font-bold print:text-sm print:pt-4 print:pb-2 ${sort && "cursor-pointer"
                        }`,
                        customThClass
                      )}
                    >
                      Sl.
                    </th>
                  )}
                  {columns.map((column: any) => (
                    <th
                      key={column.key}
                      className={cn(
                        `max-w-max text-left py-1 px-2 text-textPrimary border-b border-gray-200 print:border-gray-700 font-bold print:text-sm print:pt-4 print:pb-2 ${sort && "cursor-pointer"
                        } ${column.customClass || ""} `,
                        customThClass
                      )}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {sort && sortKey === column.key && (
                        <span className="ml-2">
                          {sortDirection === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                  {action && (
                    <th
                      className={cn(
                        `max-w-max text-left py-1 px-2 text-textPrimary border-b border-gray-200 print:border-gray-700 font-bold print:text-sm print:pt-4 print:pb-2 print:hidden sticky right-0 whitespace-nowrap bg-white ${sort && "cursor-pointer"
                        }`,
                        customThClass
                      )}
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index: number) => (
                  <tr
                    key={uniqueKey ? row[uniqueKey] : index}
                    className={cn(`${index % 2 === 0 && tableStriped ? "bg-gray-100" : ""
                      } ${tableHover && "hover:bg-gray-200"}`, customTrClass && customTrClass(row))}
                  >
                    {serialized && (
                      <td
                        className={cn(
                          "text-center py-1 px-2 border-b border-gray-200 print:border-gray-300 print:py-0.5 print:text-[13px]",
                          customTdClass
                        )}
                      >
                        {index + 1}
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`${cn(
                          "py-1 px-2 border-b border-gray-200 print:border-gray-300 print:py-0.5 print:text-[13px]",
                          customTdClass
                        )} ${column.customDataClass
                          ? column.customDataClass(row)
                          : ""
                          }`}
                      >
                        {column.render
                          ? column.render(row) // Call the custom rendering function if provided
                          : column.key.includes(".")
                            ? renderNestedCell(row, column.key)
                            : row[column.key]}
                      </td>
                    ))}

                    {action && (
                      <td
                        className={cn(
                          "py-1 px-2 border-b border-gray-200 print:border-gray-600 print:py-0.5 print:text-[13px] print:hidden sticky right-0 whitespace-nowrap bg-white",
                          customTdClass
                        )}
                      >
                        {onView && (
                          <button
                            className="bg-[#28A745] bg-opacity-[.12] text-[#28A745] p-0.5 rounded border border-gray-200 shadow-sm"
                            title="View"
                            onClick={() => onView(row[uniqueKey])}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        )}

                        {onEdit && (
                          <button
                            className="bg-[#FFC107] bg-opacity-[.12] text-[#FFC107] p-0.5 rounded border border-gray-200 shadow-sm"
                            title="Edit"
                            onClick={() => onEdit(row[uniqueKey])}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                        )}

                        {onDelete && (
                          <button
                            className="bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] p-0.5 rounded border border-gray-200 shadow-sm"
                            title="Delete"
                            onClick={() => onDelete(row[uniqueKey])}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              {sumFields && (
                <tfoot className="table-row-group">
                  <tr>
                    {serialized && (
                      <td
                        className={cn(
                          "py-1 px-2 font-semibold max-w-max text-center",
                          customTfClass
                        )}
                      ></td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("py-1 px-2 font-semibold", customTfClass)}
                      >
                        {sumFields.includes(column.key)
                          ? `${getSumResults()[column.key].toFixed(
                            sumFieldsFixed
                          )}`
                          : ""}
                      </td>
                    ))}

                    {action && (
                      <td
                        className={cn(
                          "py-1 px-2 font-semibold max-w-max text-center",
                          customTfClass
                        )}
                      ></td>
                    )}
                  </tr>
                </tfoot>
              )}

              <tfoot className="hidden print:table-footer-group">
                <tr>
                  <td colSpan={50}>
                    <div className="flex justify-between whitespace-nowrap py-3 px-2">
                      <span className="text-xs">
                        Print On: {format(new Date(), "dd/MM/yyyy p")}
                      </span>
                      <span className="text-xs">
                        Print By: {user ? user?.email : ""}
                      </span>
                      <span className="text-xs">
                        Powered By: medisoftit.com
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
