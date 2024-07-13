"use client";

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
};

export const DuplicateProductModal = ({
  products,
  onSelect,
  onClose,
}: {
  products: Product[];
  onSelect: (product: Product) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded shadow-lg w-1/2">
      <h2 className="text-lg font-bold mb-4">Select a Product</h2>
      <ul>
        {products.map((product, index: number) => (
          <li
            key={product?._id}
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => onSelect(product)}
          >
            {index + 1}. {product?.name}{" "}
            {product?.genericName && (
              <span className="font-bold">, genericName: </span>
            )}{" "}
            {product?.genericName}{" "}
            {product?.brand && <span className="font-bold">, Brand: </span>}{" "}
            {product?.brand}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);
