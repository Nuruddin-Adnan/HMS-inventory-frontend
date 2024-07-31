import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import ProductTable from "./productTable";
import { getAllProducts } from "@/api-services/product/getAllProducts";
import FilterProduct from "@/components/FilterProduct";
import { getAllCategories } from "@/api-services/category/getAllCategories";
import { getAllBrands } from "@/api-services/brand/getAllBrands";
import { getAllGenerics } from "@/api-services/generic/getAllGenerics";

export default async function Product({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";
  const category = searchParams["category"] ?? "";
  const brand = searchParams["brand"] ?? "";
  const genericName = searchParams["genericName"] ?? "";
  const status = searchParams["status"] ?? "";

  const { data: products, meta } = await getAllProducts(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }${category && `&category=${category}`}${brand && `&brand=${brand}`}${genericName && `&genericName=${genericName}`
    }${status && `&status=${status}`}&fields=-createdBy -updatedBy -strength -formulation`
  );

  const categoriesPromise = getAllCategories("status=active&fields=name _id");
  const brandsPromise = getAllBrands("status=active&fields=name");
  const genericsPromise = getAllGenerics("status=active&fields=name");

  const [categories, brands, generics] = await Promise.all([
    categoriesPromise,
    brandsPromise,
    genericsPromise,
  ]);

  return (
    <div className="card py-4 w-auto">
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name & code..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="By name, code & tag..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
        <FilterProduct
          categories={categories?.data}
          brands={brands?.data}
          generics={generics?.data}
        />
      </div>
      <div className="px-4">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
