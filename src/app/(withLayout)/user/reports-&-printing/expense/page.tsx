import React from 'react'
import ExpenseTable from './expenseTable';
import { getAllExpenses } from '@/api-services/expense/getAllExpenses';

export default async function Expense({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''

    const { data } = await getAllExpenses(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);

    return (
        <ExpenseTable expenses={data} startDate={startDate} endDate={endDate} />
    )
}
