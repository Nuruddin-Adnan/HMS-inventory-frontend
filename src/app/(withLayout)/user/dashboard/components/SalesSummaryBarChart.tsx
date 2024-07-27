"use client"
import { sumArrayField } from '@/helpers/sumArrayField';
import React, { useState } from 'react'
import { Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';


export default function SalesSummaryBarChart({
  orderSummaries,
  purchaseSummaries,
}: {
  orderSummaries: any;
  purchaseSummaries: any;
}) {
  const [year, setYear] = useState<number>(new Date().getFullYear())


  const mergedMap = new Map();

  // Add order data to the map
  orderSummaries.forEach((order: any) => {
    const key = `${order.year}-${order.month}`;
    mergedMap.set(key, {
      ...order,
      purchase: 0 // Default value if no matching purchase
    });
  });

  // Add purchase data to the map
  purchaseSummaries.forEach((purchase: any) => {
    const key = `${purchase.year}-${purchase.month}`;
    if (mergedMap.has(key)) {
      mergedMap.get(key).purchase = purchase.purchase;
    } else {
      mergedMap.set(key, {
        sale: 0,
        received: 0,
        due: 0,
        refund: 0,
        year: purchase.year,
        month: purchase.month,
        purchase: purchase.purchase
      });
    }
  });

  // Convert the map back to an array
  const mergedData = Array.from(mergedMap.values());

  // Helper function to get month index
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract years and remove duplicates
  const years = mergedData.map(item => item.year);
  const uniqueYears = Array.from(new Set(years));

  const dataByYear = mergedData.filter((data: any) => data.year === year)

  const defaultEmptyData = {
    year: dataByYear[0].year,
    sale: 0,
    received: 0,
    due: 0,
    refund: 0,
    purchase: 0
  };

  const dataWithAllMonth = months.map(month => {
    const existingData = dataByYear.find(item => item.month === month);
    if (existingData) {
      return existingData;
    } else {
      return { month, ...defaultEmptyData };
    }
  });

  const monthIndex = (month: any) => {
    return months.indexOf(month);
  };

  // Sort the array by year ascending and month ascending
  const sortedByYearMonthData = dataWithAllMonth.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year; // Sort by year ascending
    }
    return monthIndex(a.month) - monthIndex(b.month); // Sort by month ascending
  });

  const totalSalesOfYear = sumArrayField(sortedByYearMonthData, "sale")
  const totalRefundOfYear = sumArrayField(sortedByYearMonthData, "refund")
  const totalPurchaseOfYear = sumArrayField(sortedByYearMonthData, "purchase")


  return (
    <div className='card py-4'>
      <div className='flex justify-between pb-4 pt-2 px-4 mb-3 border-b gap-5'>
        <div className='2xl:text-base text-sm text-gray-600 flex flex-wrap text-nowrap 2xl:gap-x-10 gap-x-6'>
          <p>
            <span className='w-3 h-3 bg-[#008FFB] rounded-full inline-block'></span>
            <span className='inline-block px-2'>Sales</span>
            <span className='font-semibold'>৳{totalSalesOfYear}</span>
          </p>
          <p>
            <span className='w-3 h-3 bg-[#9ca3af] rounded-full inline-block'></span>
            <span className='inline-block px-2'>Refund</span>
            <span className='font-semibold'>৳{totalRefundOfYear}</span>
          </p>
          <p>
            <span className='w-3 h-3 bg-[#FEB019] rounded-full inline-block'></span>
            <span className='inline-block px-2'>Purchases</span>
            <span className='font-semibold'>৳{totalPurchaseOfYear}</span>
          </p>
        </div>
        <div className='2xl:text-base'>
          <label className='font-semibold pr-2 text-gray-700 md:inline-block hidden'>Year: </label>
          <select className='border rounded' onChange={(e: any) => setYear(parseInt(e.target.value))} defaultValue={new Date().getFullYear()}>
            {
              uniqueYears.map((year: number) => <option key={year} value={year}>{year}</option>)
            }
          </select>
        </div>
      </div>
      <ResponsiveContainer width={'100%'} height={350}>
        <ComposedChart
          width={500}
          height={350}
          data={sortedByYearMonthData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sale" fill="#008FFB" stackId="a" activeBar={<Rectangle fill="#008efbcd" />} />
          <Bar dataKey="refund" fill="#9ca3af" stackId="a" activeBar={<Rectangle fill="#d1d5db" />} />
          <Bar dataKey="purchase" fill="#FEB019" activeBar={<Rectangle fill="#feb219cc" />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
