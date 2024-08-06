
'use client'

import Barcode from 'react-barcode';
import { useRef, useState } from 'react';
import Button from '@/components/ui/button/Button';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { useReactToPrint } from 'react-to-print';

const pageStyle = `
@page{
    size: 38mm 25mm;
    margin: 30px;  
}
`

export default function BarcodeGenerate({ purchases }: { purchases: any }) {
  const componentRef = useRef(null);
  const [product, setProduct] = useState<any>('sdfsdfhsdkfsdlfsd sflskdf sdfjsdlfslfsdf sfsafsd');
  const [code, setCode] = useState<any>('243569382409834')

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });


  const data = [1, 2, 3, 4]
  return (
    <>
      <div className='w-full overflow-x-auto'>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>Purchase Date</th>
              <th>Product</th>
              <th>Lot No</th>
              <th>Invoice</th>
            </tr>
          </thead>
        </table>
      </div>
      <Button
        variant="primary-light"
        className="py-1.5 px-2 border-transparent"
        onClick={handlePrint}
      >
        <PrinterIcon className="h-5 w-5" />
      </Button>
      <div ref={componentRef} className='flex gap-2 flex-wrap print:block'>
        {
          data.map((item: any, number) => <div key={number} className='text-center text-[10px] w-[38mm] h-[25mm] border border-red-500 bg-white py-2 px-1 print:break-before-page'>
            <h2 className='font-bold leading-none truncate text-nowrap'>{process.env.NEXT_PUBLIC_APP_NAME}</h2>
            <p className='truncate text-nowrap'>{product}</p>
            <div className='grid place-items-center'>
              <Barcode value={code} height={30} margin={0} width={0.9} displayValue={false} fontSize={10} textAlign='center' />
            </div>
            <p className='leading-none font-medium'>{code}</p>
            <p className='font-bold truncate'>Price: {2324} + VAT</p>
          </div>)
        }

      </div>
    </>
  );
}
