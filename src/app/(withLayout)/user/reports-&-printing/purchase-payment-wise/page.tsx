import React from 'react'
import { getAllPayments } from '@/api-services/payment/getAllPayments';
import PurchasePaymentWiseTable from './purchasePaymentWiseTable';

export default async function PurchasePaymentWise({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllPayments(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&purchase[exists]=true&fields=createdAt createdBy purchase paymentMethod paymentType amount`);

    return (
        <PurchasePaymentWiseTable payments={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
