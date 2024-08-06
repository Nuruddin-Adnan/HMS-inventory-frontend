"use client";

import Barcode from "react-barcode";
import { useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { useReactToPrint } from "react-to-print";
import Table from "@/components/ui/table/Table";
import { format } from "date-fns";
import Modal from "@/components/ui/modal/Modal";
import Input from "@/components/ui/form/Input";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import toastError from "@/helpers/toastError";

const pageStyle = `
@page{
    size: 38mm 25mm;
    margin: 30px;  
}
`;

export default function BarcodeGenerate({ purchases }: { purchases: any }) {
  const componentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [purchase, setPurchase] = useState<any>();
  const [quantity, setQuantity] = useState<number>(1);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleOpenModal = (rowKey: any) => {
    // Implement edit logic here
    const selectedPurchaseItem = purchases.filter(
      (item: any) => item?.BILLID === rowKey
    );
    setPurchase(selectedPurchaseItem[0]);
    openModal();
  };

  const handleSubmit = async (formData: FormData) => {
    const quantity = formData.get("quantity") as any;
    const quantityAsNumber = convertStringToNumber(
      quantity as unknown as string
    );

    if (quantityAsNumber < 1) {
      toastError("Quantity should be more than or equal 1");
    } else {
      setQuantity(quantityAsNumber);
      closeModal();
      handlePrint();
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
    onAfterPrint: () => {
      setQuantity(1), setPurchase(null);
    },
  });

  const columns = [
    {
      key: "createdAt",
      label: "Entry On",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "productName",
      label: "Product Name",
      render: (row: any) => (
        <div className="whitespace-nowrap">
          {row?.productName} <br />
          Code: {row?.product[0]?.code}
        </div>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.product[0]?.brand}</div>
      ),
    },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "lotNo", label: "Lot No" },
    {
      key: "barcode",
      label: "Barcode",
      render: (row: any) => (
        <Barcode
          value={`${row?.product[0]?.tag}/${row?.BILLID}`}
          height={24}
          margin={0}
          width={0.9}
          displayValue={true}
          fontSize={12}
          textAlign="center"
        />
      ),
    },
    {
      key: "print",
      label: "Action",
      render: (row: any) => (
        <Button
          variant="danger"
          className="whitespace-nowrap py-1"
          onClick={() => handleOpenModal(row?.BILLID)}
        >
          Print
        </Button>
      ),
    },
  ];

  return (
    <>
      <div>
        <Table
          columns={columns}
          data={purchases}
          uniqueKey="BILLID"
          customTfClass="text-right whitespace-nowrap"
          customThClass="whitespace-nowrap bg-gray-200"
          customTdClass="py-0.5 text-sm"
          tableStriped
          responsive
          sort
          tableHeightClass="h-[calc(100vh-170px)]"
        />
      </div>
      {purchase && (
        <div ref={componentRef} className="hidden barcode print:block">
          {Array.from({ length: quantity }, (v, i) => i + 1)?.map(
            (item: any, number) => (
              <div
                key={number}
                className="text-center text-[10px] w-[38mm] h-[25mm] bg-white py-2 px-1 print:break-before-page"
              >
                <h2 className="font-bold leading-none truncate text-nowrap">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h2>
                <p className="truncate text-nowrap font-medium">
                  {purchase?.productName}
                </p>
                <div className="grid place-items-center">
                  <Barcode
                    value={`${purchase?.product[0]?.tag}${purchase?.BILLID}`}
                    height={30}
                    margin={0}
                    marginLeft={1}
                    width={0.9}
                    displayValue={false}
                    fontSize={10}
                    textAlign="center"
                  />
                </div>
                <p className="leading-none font-medium">{`${purchase?.product[0]?.tag}/${purchase?.BILLID}`}</p>
                <p className="font-bold truncate">
                  Price: {purchase?.product[0]?.price} TK + VAT
                </p>
              </div>
            )
          )}
        </div>
      )}
      {isOpen && (
        <Modal
          onCloseModal={closeModal}
          openModal={isOpen}
          className="max-w-md"
          title="Enter quantity"
          titleClassName="text-textPrimary font-bold"
        >
          <form action={handleSubmit}>
            <div className="card p-6 border grid gap-3 mt-3">
              <Input
                type="number"
                name="quantity"
                label="Quantity"
                value={quantity}
                onFocus={(e: any) => e.target.select()}
                onChange={(e: any) =>
                  e.target.value >= 1 ? setQuantity(e.target.value) : ""
                }
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full block text-base"
              >
                Print Barcode
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
