import { getAllPurchases } from "@/api-services/purchase/getAllPurchases";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getAllSuppliers } from "@/api-services/supplier/getAllSuppliers";
import FilterPurchase from "@/components/FilterPurchase";
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
        `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`}&fields=BILLID product.tag product.brand productName invoiceNo lotNo`
    );

    return (
        <div className="card py-4">
            <h2 className="pt-0 pb-2 px-4 mb-2 border-b font-bold text-lg">
                Generate Barcode
            </h2>
            <div className="px-4">
                <SearchControl placeholder="By name, lot & invoice..." className="py-2 border-primary" />
            </div>
            <div className="px-4">
                <BarcodeGenerate purchases={purchases} />
            </div>
        </div>
    );
}
