"use client";

import { getAllProductsClient } from "@/api-services/product/getAllProductsClient";
import { createPurchase } from "@/api-services/purchase/createPurchase";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Modal from "@/components/ui/modal/Modal";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { paymentMethodOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function PurchaseCreateForm({
  products,
  suppliers,
}: {
  products: any;
  suppliers: any;
}) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productCode, setProductCode] = useState<any>();
  const [product, setProduct] = useState({
    label: "",
    value: "",
  });
  const [unit, setUnit] = useState<string>();
  const [searchProduct, setSearchProduct] = useState<any>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const productSelectRef = useRef<SelectInstance | null>(null);
  const supplierSelectRef = useRef<SelectInstance | null>(null);

  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);

  const router = useRouter()

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleProductSearchByCode = async (formData: FormData) => {
    const result = await getAllProductsClient(
      `code=${formData.get("code")}&status=active&sort=-createdAt&limit=10`
    );
    if (result && result.success === true) {
      if (result?.data.length === 1) {
        setProduct({
          label: `${result?.data[0]?.name}, ${result?.data[0]?.genericName} ⟶${result?.data[0]?.brand}`,
          value: result?.data[0]?._id,
        });
        setProductUnit(result?.data[0]?._id);
      } else if (result?.data.length > 1) {
        setSearchProduct(result?.data); // Set the product search by code result
        openModal(); // open modal to select one of the product
      } else {
        toastError("No product found!");
      }
    }
  };

  const setProductUnit = (productId: any) => {
    const filteredProduct = products.filter(
      (product: any) => product?._id === productId
    );
    setUnit(filteredProduct[0]?.unit);
    return filteredProduct[0]?.unit;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Convert  fields as number
      const quantity = (formData.get("quantity") ?? "") as string;
      const price = (formData.get("price") ?? "") as string;
      const advance = (formData.get("advance") ?? "") as string;

      const quantityAsNumber: number = convertStringToNumber(quantity);
      const priceAsNumber: number = convertStringToNumber(price);
      const advanceAsNumber: number = convertStringToNumber(advance);

      const payload = {
        product: (formData.get("product") ?? "") as string,
        supplier: (formData.get("supplier") ?? "") as string,
        invoiceNo: (formData.get("invoiceNo") ?? "") as string,
        lotNo: (formData.get("lotNo") ?? "") as string,
        expiryDate: (formData.get("expiryDate") ?? "") as string,
        unit: unit,
        paymentMethod: (formData.get("paymentMethod") ?? "") as string,
        quantity: quantityAsNumber,
        price: priceAsNumber,
        advance: advanceAsNumber,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await createPurchase(nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }

        await tagRevalidate("purchase");
        await tagRevalidate("stock");
        handleReset()
        router.back();
      }
    } finally {
      setLoading(false);
    }

  };

  const handleReset = () => {
    setProductCode("");
    setProduct({
      label: "",
      value: "",
    });
    if (formRef.current) {
      formRef.current.reset();
    }
    if (productSelectRef.current) {
      productSelectRef.current.clearValue();
    }
    if (supplierSelectRef.current) {
      supplierSelectRef.current.clearValue();
    }
  };

  const productOptions = products.map((item: any) => {
    return {
      label: `${item?.name} ${item?.genericName ? `⟶${item?.genericName}` : ""
        } ⟶${item?.brand}`,
      value: item?._id,
    };
  });

  const supplierOptions = suppliers.map((item: any) => {
    return {
      label: `${item?.name} ⟶${item?.contactNo} ⟶${item?.brand[0]?.name}`,
      value: item?._id,
    };
  });

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form action={handleProductSearchByCode} className="mb-4">
          <span className="block text-sm font-semibold text-textPrimary mb-1">
            Product code
          </span>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              name="code"
              className="border-primary focus-visible:border-primary focus:border-primary"
              value={productCode}
              onChange={(e: any) => setProductCode(e.target.value)}
              autoFocus
              onFocus={(e: any) => e.target.select()}
            />
            <div>
              <Button type="submit" variant="primary-light" className="py-1.5">
                Search
              </Button>
            </div>
          </div>
        </form>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid 2xl:gap-4 gap-3"
        >
          <div className="flex 2xl:gap-4 gap-3 lg:flex-row flex-col">
            <div className="lg:w-3/5 flex flex-col 2xl:gap-4 gap-3">
              <label>
                <span className="text-textPrimary font-semibold block pb-0.5">
                  Product Name*
                </span>
                <ReactSelect
                  ref={productSelectRef}
                  name="product"
                  options={productOptions}
                  styles={reactSelectStyles}
                  isClearable={true}
                  value={product}
                  onChange={(value: any) => {
                    setProduct(value);
                    setProductUnit(value?.value);
                  }}
                  required
                />
              </label>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <label>
                  <span className="text-textPrimary font-semibold block pb-0.5">Supplier*</span>
                  <ReactSelect
                    ref={supplierSelectRef}
                    name="supplier"
                    options={supplierOptions}
                    styles={reactSelectStyles}
                    required
                  />
                </label>
                <Input type="text" name="invoiceNo" label="Invoice No" />
              </div>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <Input type="text" name="lotNo" label="Lot No" />
                <Input type="date" name="expiryDate" label="Expiry Date" required />
              </div>
            </div>
            <div className="lg:w-2/5 2xl:gap-4 gap-3 lg:border-s lg:ps-4">
              <div className="grid lg:gap-52 gap-16">
                <div className="grid  gap-3">
                  <p className="flex gap-5 font-bold border py-1 px-2 bg-blue-500 bg-opacity-20 text-blue-700 rounded">
                    Unit: <span>{unit}</span>
                  </p>
                  <Input
                    type="number"
                    name="quantity"
                    label="Product quantity"
                    inline
                    className="lg:w-2/3"
                    labelClassName="lg:w-1/3"
                    value={quantity}
                    onChange={(e: any) => setQuantity(e?.target?.value)}
                    onFocus={(e: any) => e.target.select()}
                  />
                  <Input
                    type="number"
                    name="price"
                    label="Unit price"
                    inline
                    className="lg:w-2/3"
                    labelClassName="lg:w-1/3"
                    value={price}
                    onChange={(e: any) => setPrice(e?.target?.value)}
                    onFocus={(e: any) => e.target.select()}
                  />
                </div>
                <div className="lg:sticky bottom-5">
                  <div className="flex space-x-4 justify-between text-base whitespace-nowrap">
                    <div className="space-y-2 w-1/3">
                      <Select
                        options={paymentMethodOptions}
                        name="paymentMethod"
                        label="Payment Method"
                        className="text-base"
                        labelClassName="text-base whitespace-nowrap"
                        defaultValue="cash"
                      />
                    </div>
                    <div className="grid 2xl:gap-4 gap-3 w-3/4">
                      <div className="grid  space-y-1 text-right items-center">
                        <p className="text-textPrimary font-bold ">
                          Payable Amount :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {quantity * price} TK
                        </p>

                        <div className="border-b col-span-2"></div>

                        <p className="text-textPrimary">Advance Amount :</p>
                        <div className="relative ml-auto w-2/3">
                          <Input
                            name="advance"
                            type="number"
                            step="0.001"
                            onChange={(e: any) => setAdvance(e.target.value)}
                            onFocus={(e: any) => e.target.select()}
                            className="pr-6 border-blue-300"
                            required
                          />
                          <span className="absolute top-1/2 right-2 -translate-y-1/2">
                            TK
                          </span>
                        </div>

                        <p className="text-textPrimary font-bold">
                          Due Amount :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {quantity * price - advance > 0
                            ? quantity * price - advance
                            : 0}
                          TK
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center justify-end mt-5 text-base">
                    <Button
                      type="reset"
                      variant="danger"
                      className="mr-2"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                    <Button
                      type="reset"
                      variant="primary-light"
                      className="mr-2"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-48 justify-center"
                      loading={loading}
                    >
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {isOpen && (
        <Modal
          onCloseModal={closeModal}
          openModal={isOpen}
          className="max-w-3xl"
          titleClassName="border-b"
          title="Please select one"
        >
          <div className="flex flex-col text-gray-700 bg-white  rounded-xl">
            <nav className="flex min-w-[240px] flex-col gap-0.5 font-sans text-base font-normal text-blue-gray-700">
              {searchProduct.map((product: any, index: number) => (
                <button
                  key={index}
                  className="flex items-center w-full p-2 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-gray-200 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-gray-200 active:text-blue-gray-900"
                  onClick={() => {
                    setProduct({
                      label: `${product?.name} ⟶${product?.brand}`,
                      value: product?._id,
                    });
                    setProductUnit(product?._id);
                    closeModal();
                  }}
                >
                  <span className="font-medium">{index + 1}. </span> &nbsp;
                  <span>{product?.name}</span>,&nbsp;&nbsp;
                  <span className="font-medium pr-1">Brand: </span>{" "}
                  {product?.brand}, &nbsp;&nbsp;
                  <span className="font-medium pr-1">Price: </span>{" "}
                  {product?.price}
                </button>
              ))}
            </nav>
          </div>
        </Modal>
      )}
    </>
  );
}
