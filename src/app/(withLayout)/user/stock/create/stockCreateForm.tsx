"use client";

import { getAllProductsClient } from "@/api-services/product/getAllProductsClient";
import { createStock } from "@/api-services/stock/createStock";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Modal from "@/components/ui/modal/Modal";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function StockCreateForm({ products }: { products: any }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productCode, setProductCode] = useState<any>();
  const [product, setProduct] = useState({
    label: "",
    value: "",
  });
  const [searchProduct, setSearchProduct] = useState<any>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const productSelectRef = useRef<SelectInstance | null>(null);

  const router = useRouter()

  const reactSelectStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      minHeight: "auto",
      color: "#18181B",
      padding: "0px",
      border: "1px solid #e5e7eb",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      padding: "0px",
      minHeight: "auto",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0px 4px",
    }),
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleProductSearchByCodeSubmit = async (formData: FormData) => {
    const result = await getAllProductsClient(
      `code=${formData.get("code")}&status=active&sort=-createdAt&limit=10`
    );
    if (result && result.success === true) {
      if (result?.data.length === 1) {
        setProduct({
          label: `${result?.data[0]?.name} ⟶${result?.data[0]?.brand}`,
          value: result?.data[0]?._id,
        });
      } else if (result?.data.length > 1) {
        setSearchProduct(result?.data); // Set the product search by code result
        openModal(); // open modal to select one of the product
      } else {
        toastError("No product found!");
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert  fields as number
    const quantity = (formData.get("quantity") ?? "") as string;
    const alertQuantity = (formData.get("alertQuantity") ?? "") as string;

    const quantityAsNumber: number = convertStringToNumber(quantity);
    const alertQuantityAsNumber: number = convertStringToNumber(alertQuantity);

    const payload = {
      product: (formData.get("product") ?? "") as string,
      quantity: quantityAsNumber,
      alertQuantity: alertQuantityAsNumber,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createStock(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("stock");
      redirect("/user/stock");
    }
    setLoading(false);
  };

  // const handleReset = () => {
  //   setProductCode("");
  //   setProduct({
  //     label: "",
  //     value: "",
  //   });
  //   if (formRef.current) {
  //     formRef.current.reset();
  //   }
  //   if (productSelectRef.current) {
  //     productSelectRef.current.clearValue();
  //   }
  // };

  const productOptions = products.map((product: any) => ({
    value: product?._id,
    label: `${product?.name} ${product?.genericName ? `⟶${product?.genericName}` : ""
      } ⟶${product?.brand}`,
  }));

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form action={handleProductSearchByCodeSubmit} className="mb-4">
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
          action={handleSubmit}
          className="grid 2xl:gap-4 gap-3"
        >
          <label>
            <span className="font-semibold block pb-0.5">Product Name</span>
            <ReactSelect
              ref={productSelectRef}
              name="product"
              options={productOptions}
              styles={reactSelectStyles}
              value={product}
              onChange={(value: any) => setProduct(value)}
            />
          </label>
          <div className="grid grid-cols-2 2xl:gap-4 gap-3">
            <Input type="number" name="quantity" label="Product quantity*" />
            <Input type="number" name="alertQuantity" label="Alert Quantity*" />
          </div>
          <div className="text-right">
            <Button
              type="button"
              variant="danger"
              className="me-2"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" className="px-10" loading={loading}>
              Create
            </Button>
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
