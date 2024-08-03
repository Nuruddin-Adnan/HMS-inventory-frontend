import React from 'react'
import { getAllStockAdjustments } from '@/api-services/stock-adjustment/getAllStockAdjustments';
import StockAdjustmentTable from './stockAdjustmentTable';

export default async function StockAdjustment({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllStockAdjustments(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}`);

    return (
        <StockAdjustmentTable stockAdjusments={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
