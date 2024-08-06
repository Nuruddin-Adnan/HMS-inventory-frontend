import { getAllPurchases } from "@/api-services/purchase/getAllPurchases";
import SearchControl from "@/components/ui/SearchControl";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import BarcodeGenerate from "./BarcodeGenerate";

export default async function Purchase({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "10";
  const query = searchParams["query"] ?? "";

  const { data: purchases } = await getAllPurchases(
    `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=createdAt BILLID product.tag product.brand product.price product.code productName invoiceNo lotNo`
  );

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center gap-4 pb-2 mb-2 border-b">
        <h2 className="font-bold text-lg text-textPrimary">
          {" "}
          Generate Barcode{" "}
        </h2>
        <div>
          <SearchControl
            placeholder="By name, lot & invoice..."
          />
        </div>
      </div>
      <BarcodeGenerate purchases={purchases} />
    </div>
  );
}
