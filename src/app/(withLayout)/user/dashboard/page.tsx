import React, { Suspense } from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getOrderSummary } from "@/api-services/order/getOrderSummary";
import { getPurchaseSummary } from "@/api-services/purchase/getPurchaseSummary";
import LoadingComponent from "@/components/ui/LoadingComponent";
import SalesSummaryBarChart from "./components/SalesSummaryBarChart";
import SalesSummaryPieChart from "./components/SalesSummaryPieChart";
import { getAllOrders } from "@/api-services/order/getAllOrders";
import { getLowStocks } from "@/api-services/stock/getLowStocks";
import Widget from "./components/Widget";
import LowStockTable from "./components/LowStockTable";
import RecentOrderTable from "./components/RecentOrderTable";

export default async function UserDashboard() {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const orderSummaryPromise = getOrderSummary();
  const purchaseSummaryPromise = getPurchaseSummary();
  const orderPromise = getAllOrders(`sort=-createdAt&page=1&limit=20&fields=createdAt BILLID total received due paymentStatus`);
  const stocksPromise = getLowStocks(`page=1&limit=100&fields=-createdBy -createdAt -updatedBy`);


  const [
    orderSummaries,
    purchaseSummaries,
    orders,
    stocks
  ] = await Promise.all([
    orderSummaryPromise,
    purchaseSummaryPromise,
    orderPromise,
    stocksPromise
  ])


  return (
    <div>
      <div className="mb-4">
        <Suspense fallback={<LoadingComponent />}>
          <Widget orderSummaries={orderSummaries?.data} purchaseSummaries={purchaseSummaries?.data} />
        </Suspense>
      </div>
      <div className="grid grid-cols-3 lg:gap-4 gap-3">
        <div className="lg:col-span-2 col-span-full">
          <Suspense fallback={<LoadingComponent />}>
            <SalesSummaryBarChart orderSummaries={orderSummaries?.data} purchaseSummaries={purchaseSummaries?.data} />
          </Suspense>
        </div>
        <div className="lg:col-span-1 col-span-full">
          <Suspense fallback={<LoadingComponent />}>
            <SalesSummaryPieChart orderSummaries={orderSummaries?.data} />
          </Suspense>
        </div>
      </div>
      <div className="lg:grid grid-cols-2 gap-4 my-4">
        <div className="card p-4 h-full">
          <Suspense fallback={<LoadingComponent />}>
            <h2 className="font-bold text-lg text-red-500 pb-2">Low Stock Products</h2>
            <LowStockTable stocks={stocks?.data} />
          </Suspense>
        </div>
        <div className="card p-4 h-full">
          <Suspense fallback={<LoadingComponent />}>
            <h2 className="font-bold text-lg text-gray-700 pb-2">Recent Sales</h2>
            <RecentOrderTable orders={orders?.data} />
          </Suspense>
        </div>
      </div>

    </div>
  );
}
