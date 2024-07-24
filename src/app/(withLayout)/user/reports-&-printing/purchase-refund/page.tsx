import React from 'react'
import PurchaseRefundTable from './purchaseRefundTable';
import { getAllRefunds } from '@/api-services/refund/getAllRefunds';

export default async function PurchaseRefund({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllRefunds(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&purchase[exists]=true&page=${page}&limit=${limit}&fields=createdAt createdBy.name purchase.BILLID product.name product.code unit price quantity total amount refundMethod`);

    return (
        <PurchaseRefundTable refunds={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
