import { getAllPurchases } from "@/api-services/purchase/getAllPurchases";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import LowExpireProductTable from "./lowExpiredProductTable";
import FilterProductExpire from "@/components/FilterProductExpire";

export default async function LowExpiredProduct({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge", "salesman"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";
  const isExpired = searchParams["isExpired"] ?? "";


  // Function to format date in YYYY-MM-DD format
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const currentDate = formatDate(new Date())

  // Calculate the date 180 days after
  function getDate180DaysAfter() {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() + 180); // Addition 180 days from today
    return formatDate(pastDate);
  }

  // Get and log the date 180 days after
  const date180DaysAfter = getDate180DaysAfter();

  let api: any

  if (isExpired) {
    api = await getAllPurchases(
      `sort=expiryDate&page=${page}&limit=${limit}${query && `&search=${query}`}&expiryDate[lt]=${currentDate}&fields=createdAt product.code supplier.brandInfo supplier.name supplier.contactNo expiryDate productName invoiceNo lotNo`
    );
  } else {
    api = await getAllPurchases(
      `sort=expiryDate&page=${page}&limit=${limit}${query && `&search=${query}`}&expiryDate[lte]=${date180DaysAfter}&expiryDate[gte]=${currentDate}&fields=createdAt product.code supplier.brandInfo supplier.name supplier.contactNo expiryDate productName invoiceNo lotNo`
    );
  }

  const { data: purchases, meta } = api



  return (
    <div className="card py-4">
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="By name, lot & invoice..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
        <FilterProductExpire />
      </div>
      <div className="px-4">
        <LowExpireProductTable isExpired={isExpired} purchases={purchases} />
      </div>
    </div>
  );
}
