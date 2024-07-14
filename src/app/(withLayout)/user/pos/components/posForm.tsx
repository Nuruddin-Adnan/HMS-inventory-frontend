"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactSelect from "react-select";
import { DuplicateProductModal } from "./duplicateProductModal";
import toastError from "@/helpers/toastError";
import { MinusIcon, PlusIcon, PrinterIcon } from "@heroicons/react/24/outline";
import Input from "@/components/ui/form/Input";
import Button from "@/components/ui/button/Button";
import { getAllCustomersClient } from "@/api-services/customer/getAllCustomersClient";
import { paymentMethodOptions } from "@/lib/selectOptions";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { createOrder } from "@/api-services/order/createOrder";
import calculatePercentageToAmount from "@/helpers/calculatePercentageToAmount";
import { useReactToPrint } from "react-to-print";
import { getSingleOrderClient } from "@/api-services/order/getSingleOrderClient";
import Invoice from "@/components/Invoice";
import { toFixedIfNecessary } from "@/helpers/toFixedIfNecessary";

type Product = {
  _id: string;
  code: string;
  tag: string;
  name: string;
  genericName: string;
  brand: string;
  price: number;
  unit: string;
  quantity?: number;
  subtotal: number;
  discountPercent?: number;
  total?: number;
};

const pageStyle = `
@page{
    size: portrait
}`;

export default function POSPForm({
  productsList,
  tax,
}: {
  productsList: any;
  tax: any;
}) {
  const productCodeInputRef = useRef<HTMLInputElement>(null);
  const customerFormRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [invoiceNo, setInvoiceNo] = useState<any>(null);
  const [received, setReceived] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountTotal, setDiscountTotal] = useState<number>(0);
  const [vatPercent, setVatPercent] = useState<number>(tax?.tax || 0);
  const [productCode, setProductCode] = useState<string>("");
  const [duplicateProducts, setDuplicateProducts] = useState<Product[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);

  // print setup
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const promiseResolveRef = useRef<((value: any) => void) | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>();

  const productOptions = productsList.map((product: any) => ({
    value: product?._id,
    label: `${product?.name} ${
      product?.genericName ? `⟶${product?.genericName}` : ""
    } ⟶${product?.brand}`,
  }));

  const subtotal: number = products.reduce(
    (sum: number, item: any) => sum + item.total * item.quantity,
    0
  );

  const vatAmount = calculatePercentageToAmount(vatPercent, subtotal) || 0;

  // cancule total
  const total =
    discountTotal > 0
      ? subtotal + vatAmount - discountTotal
      : subtotal +
        vatAmount -
        calculatePercentageToAmount(subtotal + vatAmount, discountPercent);

  const addProduct = useCallback(
    (product: Product) => {
      const existingProductIndex = products.findIndex(
        (p) => p?._id === product?._id
      );
      if (existingProductIndex > -1) {
        const updatedProducts = [...products];

        updatedProducts[existingProductIndex].quantity! += 1;
        setProducts(updatedProducts);
        setProductCode("");
      } else {
        const price = product.price;
        const unit = product.unit;
        const discountPercent = product?.discountPercent ?? 0;
        const discount = price * (discountPercent / 100);
        const total = price - discount;

        setProducts([
          ...products,
          {
            ...product,
            quantity: 1,
            unit,
            price,
            discountPercent,
            subtotal: price,
            total,
          },
        ]);
        setProductCode("");
      }

      // reset the total discount
      setDiscountPercent(0);
      setDiscountTotal(0);
    },
    [products]
  );

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current(undefined);
    }
  }, [isPrinting]);

  // print invoice
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
      productCodeInputRef.current!.focus();
    },
    pageStyle: pageStyle,
  });

  useEffect(() => {
    if (selectedProduct) {
      const product = productsList.find(
        (p: any) => p?._id === selectedProduct?.value
      );

      if (product) {
        addProduct(product);
        setSelectedProduct(null);
      }
    }
  }, [selectedProduct, addProduct, productsList]);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = productsList.find(
      (p: any) => p?._id === selectedProduct?.value
    );
    if (product) {
      addProduct(product);
      setSelectedProduct(null);
    }
  };

  const handleProductCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const foundProducts = productsList.filter(
        (p: any) => p.code === productCode
      );
      if (foundProducts.length > 1) {
        setDuplicateProducts(foundProducts);
        setShowDuplicateModal(true);
      } else if (foundProducts.length === 1) {
        const product = foundProducts[0];

        if (product) {
          addProduct(product);
          setProductCode("");
        }
      } else {
        toastError("Product not found");
      }
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updatedProducts = [...products];
    if (quantity >= 1) {
      updatedProducts[index].quantity = quantity;
      setProducts(updatedProducts);
    }
  };

  const deleteProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleGetSingleCustomer = async (formData: FormData) => {
    const contactNo = (formData.get("contactNo") ?? "") as string;
    const result = await getAllCustomersClient(
      `contactNo=${contactNo}&limit=1`
    );

    if (result && result.success === true) {
      if (result?.data.length < 1) {
        toastError("Customer not found!");
      } else {
        setCustomer(result?.data[0]);
      }
    }
  };

  const handleChangeDiscountAmount = (e: any) => {
    // reset the total discount percent
    setDiscountPercent(0);
    setDiscountTotal(e.target.value);
  };

  const handleChangeDiscountPercent = (e: any) => {
    // reset the total discount amount
    setDiscountTotal(0);

    const percent = Number(e.target.value);
    if (percent >= 0 && percent < 101) {
      // const amount = calculatePercentageToAmount(percent, subtotal);
      setDiscountPercent(percent);
    }
  };

  const handleChangeDiscountPercentItem = (
    index: number,
    discountPercent: number
  ) => {
    const updatedProducts = [...products];
    if (discountPercent >= 0 && discountPercent < 101) {
      const itemPrice = updatedProducts[index].price;

      updatedProducts[index].discountPercent = Number(discountPercent);
      updatedProducts[index].total =
        Number(itemPrice) - Number(itemPrice) * (discountPercent / 100);
      setProducts(updatedProducts);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const orderItems = products.map((item) => {
      return {
        product: item._id,
        unit: item.unit,
        price: item.price,
        quantity: item.quantity,
        discountPercent: item.discountPercent,
        total: item?.total,
      };
    });

    // Convert  fields as number
    const discountPercent = (formData.get("discountPercent") ?? "") as string;
    const discountAmount = (formData.get("discountAmount") ?? "") as string;
    const vatPercent = (formData.get("vatPercent") ?? "") as string;
    const received = (formData.get("received") ?? "") as string;

    const discountPercentAsNumber: number =
      convertStringToNumber(discountPercent);
    const discountAmountAsNumber: number =
      convertStringToNumber(discountAmount);
    const vatPercentAsNumber: number = convertStringToNumber(vatPercent);
    const receivedAsNumber: number = convertStringToNumber(received);

    const payload = {
      CUSID: customer?.CUSID,
      items: orderItems,
      discountPercent: discountPercentAsNumber,
      discountAmount: discountAmountAsNumber,
      vatPercent: vatPercentAsNumber,
      received: total - receivedAsNumber > 0 ? receivedAsNumber : total,
      paymentMethod: (formData.get("paymentMethod") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createOrder(nonEmptyPayload);
    if (result && result.success === true) {
      setInvoiceData(result?.data);
      await tagRevalidate("order");
      await tagRevalidate("stock");

      // print
      handlePrint();

      // reset all the data and get ready for next order
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
      handleReset();
    }
    setLoading(false);
  };

  const handlePrintInvoice = async (invoiceNo: any) => {
    if (invoiceNo.length >= 8) {
      const result = await getSingleOrderClient(invoiceNo);
      if (result && result.success === true) {
        if (!result?.data) {
          toastError("No order found!");
        } else {
          setInvoiceData(result?.data);
          handlePrint();
        }
      }
    }
  };

  // reset form need to modified and use it final in from submit
  const handleReset = () => {
    setProductCode("");
    setProducts([]);
    setCustomer(null);
    setSelectedProduct(null);
    setReceived(0);
    setDiscountTotal(0);
    setDiscountPercent(0);
    setVatPercent(tax?.tax || 0);
    setInvoiceNo("");

    if (productCodeInputRef.current) {
      productCodeInputRef.current.select();
    }
    if (customerFormRef.current) {
      customerFormRef.current.reset();
    }
  };

  // handle duplicate product selection
  const handleDuplicateProductSelect = (product: Product) => {
    if (product) {
      addProduct(product);
    }
    setProductCode("");
    setShowDuplicateModal(false);
  };

  return (
    <div className="flex flex-col gap-3 xl:flex-row h-[calc(100vh-86px)]">
      <div className="w-full xl:w-[70%]">
        <div className="bg-gray-200 rounded p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-5 col-span-2">
              <h2 className="text-base font-bold whitespace-nowrap w-28 flex-shrink-0">
                Product Code
              </h2>
              <span className="font-bold">:</span>
              <input
                ref={productCodeInputRef}
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                onKeyDown={handleProductCodeKeyDown}
                onFocus={(e: any) => e.target.select()}
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Enter product code"
                autoFocus
              />
            </div>
            <div className="flex h-full w-full relative rounded overflow-hidden">
              <Input
                value={invoiceNo}
                onChange={(e: any) => {
                  setInvoiceNo(e.target.value);
                  handlePrintInvoice(e.target.value);
                }}
                inlineClassName="w-full"
                labelClassName="text-base"
                placeholder="Enter invoice no..."
                className="h-full border border-gray-300 pr-16"
                required
                onFocus={(e: any) => e.target.select()}
              />
              <div className="absolute right-0 bg-primary rounded-r  text-white px-3 border grid place-items-center h-full top-1/2 -translate-y-1/2 z-10">
                <PrinterIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <h2 className="text-base font-bold whitespace-nowrap w-28 flex-shrink-0">
              Search Product
            </h2>
            <span className="font-bold">:</span>
            <form onSubmit={handleAddProduct} className="w-full">
              <div className="flex items-center gap-2">
                <ReactSelect
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  options={productOptions}
                  className="w-full"
                  placeholder="Select a product"
                />
              </div>
            </form>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">
                <form
                  ref={customerFormRef}
                  action={handleGetSingleCustomer}
                  className="flex items-end w-full"
                >
                  <div className="w-full">
                    <Input
                      label="Customer contact"
                      name="contactNo"
                      className="py-1.5 rounded-r-none"
                      labelClassName="text-base"
                      placeholder="Enter customer contact no..."
                      required
                      onFocus={(e: any) => e.target.select()}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      className="py-1.5 rounded-l-none mb-[1px]"
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </div>
              <div className="col-span-3">
                <Input
                  label="Customer Name"
                  className="py-1.5"
                  labelClassName="text-base"
                  value={customer?.name ?? ""}
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Points"
                  className="py-1.5"
                  labelClassName="text-base"
                  value={customer?.points ?? ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="overflow-x-auto h-[calc(100vh-316px)] overflow-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Product
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Quantity
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Unit
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Price
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Subtotal
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300 text-nowrap">
                    Discount %
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Total
                  </th>
                  <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="py-1 px-4 border">{product.name}</td>
                    <td className="py-1 px-4 border">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() =>
                            updateQuantity(index, product.quantity! - 1)
                          }
                          className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-l"
                        >
                          <MinusIcon className="w-5 h-5" />
                        </button>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(index, parseInt(e.target.value))
                          }
                          onFocus={(e: any) => e.target.select()}
                          className="border px-0.5 py-1 w-12 text-center font-medium"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(index, product.quantity! + 1)
                          }
                          className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-r"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-1 px-4 border text-center">
                      {product?.unit}
                    </td>
                    <td className="py-1 px-4 border text-center">
                      {product?.price}
                    </td>
                    <td className="py-1 px-4 border text-center">
                      {product?.price * product?.quantity!}
                    </td>
                    <td className="py-1 px-4 border text-center">
                      <Input
                        type="number"
                        value={product?.discountPercent}
                        className="w-16 border-gray-300"
                        inlineClassName="flex justify-center"
                        onChange={(e: any) =>
                          handleChangeDiscountPercentItem(index, e.target.value)
                        }
                        onFocus={(e: any) => e.target.select()}
                      />
                    </td>
                    <td className="py-1 px-4 border text-center">
                      {product.price * product.quantity! -
                        product?.price *
                          product?.quantity! *
                          (product?.discountPercent! / 100)}
                    </td>
                    <td className="py-1 px-4 border text-center">
                      <button
                        onClick={() => deleteProduct(index)}
                        className="bg-red-500 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[30%] p-4 rounded flex flex-col justify-between bg-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold bg-green-500 bg-opacity-20 text-green-700 py-1 px-4 rounded  text-center">
            <span className="me-5">Total: </span> {toFixedIfNecessary(total, 2)}{" "}
            TK
          </h2>
          <h2 className="text-lg font-bold bg-red-500 bg-opacity-20 text-red-700 py-1 px-4 rounded mt-2 mb-5 text-center">
            <span className="me-5">Change: </span>{" "}
            {total - received < 0
              ? toFixedIfNecessary(Math.abs(total - received), 2)
              : 0}{" "}
            TK
          </h2>
        </div>

        <form
          ref={formRef}
          action={handleSubmit}
          className="lg:sticky bottom-5"
        >
          <div className="flex justify-between text-base whitespace-nowrap">
            <div className="grid 2xl:gap-4 gap-3 w-full">
              <div className="grid  space-y-1 text-right items-center">
                <p className="text-textPrimary font-bold ">Subtotal : </p>
                <p className="text-textPrimary font-bold">
                  {toFixedIfNecessary(subtotal, 2)} TK
                </p>

                <p className="text-textPrimary">Vat % :</p>
                <div className="relative ml-auto w-2/3">
                  <Input
                    name="vatPercent"
                    type="number"
                    className="pr-6 border-blue-300 py-0.5"
                    defaultValue={tax?.tax}
                    onChange={(e: any) => setVatPercent(e.target.value)}
                    onFocus={(e: any) => e.target.select()}
                    required
                  />
                  <span className="absolute top-1/2 right-2 -translate-y-1/2">
                    %
                  </span>
                </div>

                <p className="text-textPrimary">Discount % :</p>
                <div className="relative ml-auto w-2/3">
                  <Input
                    id="discountPercent"
                    name="discountPercent"
                    type="number"
                    value={discountPercent}
                    onChange={(e: any) => handleChangeDiscountPercent(e)}
                    onFocus={(e: any) => e.target.select()}
                    className="pr-6 border-blue-300 py-0.5"
                    required
                  />
                  <span className="absolute top-1/2 right-2 -translate-y-1/2">
                    %
                  </span>
                </div>

                <p className="text-textPrimary">Discount :</p>
                <div className="relative ml-auto w-2/3">
                  <Input
                    id="discountAmount"
                    name="discountAmount"
                    type="number"
                    step="0.001"
                    value={discountTotal}
                    onChange={(e: any) => handleChangeDiscountAmount(e)}
                    onFocus={(e: any) => e.target.select()}
                    className="pr-6 border-blue-300 py-0.5"
                    required
                  />
                  <span className="absolute top-1/2 right-2 -translate-y-1/2">
                    TK
                  </span>
                </div>

                <div className="border-b col-span-2 border-b-gray-100"></div>

                <p className="text-textPrimary">Payment Method :</p>
                <div className="relative ml-auto w-2/3">
                  <Select
                    options={paymentMethodOptions}
                    name="paymentMethod"
                    className="text-base border-blue-300"
                    labelClassName="text-base whitespace-nowrap"
                    inline
                    defaultValue="cash"
                  />
                </div>

                <p className="text-textPrimary">Received Amount :</p>
                <div className="relative ml-auto w-2/3">
                  <Input
                    name="received"
                    type="number"
                    step="0.001"
                    onChange={(e: any) => setReceived(e.target.value)}
                    onFocus={(e: any) => e.target.select()}
                    className="pr-6 border-green-500 py-2 text-base"
                    required
                  />
                  <span className="absolute top-1/2 right-2 -translate-y-1/2">
                    TK
                  </span>
                </div>

                <p className="text-textPrimary font-bold">Due Amount :</p>
                <p className="text-textPrimary font-bold">
                  {total - received > 0
                    ? toFixedIfNecessary(total - received, 2)
                    : 0}{" "}
                  TK
                </p>
              </div>
            </div>
          </div>

          <div className="text-right flex gap-2 text-base mt-5">
            <Button type="reset" variant="primary-light" onClick={handleReset}>
              Reset
            </Button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded w-full font-semibold"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>

      {showDuplicateModal && (
        <DuplicateProductModal
          products={duplicateProducts}
          onSelect={handleDuplicateProductSelect}
          onClose={() => setShowDuplicateModal(false)}
        />
      )}

      {isPrinting && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <Invoice order={invoiceData} />
          </div>
        </div>
      )}
    </div>
  );
}
