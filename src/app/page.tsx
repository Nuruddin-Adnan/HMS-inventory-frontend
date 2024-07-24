import { isUserExist } from "@/lib/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import "core-js";
import Header from "@/components/ui/header/Header";

import dashboard from "../../public/icon/dashboard.png";
import accounts from "../../public/icon/budget.png";
import invoice from "../../public/icon/invoice.png";
import pos from "../../public/icon/point-of-sale.png";
import brand from "../../public/icon/brand-image.png";
import category from "../../public/icon/classification.png";
import customer from "../../public/icon/customer.png";
import helpDesk from "../../public/icon/help-desk.png";
import user from "../../public/icon/user.png";
import supplier from "../../public/icon/supplier.png";
import saleReport from "../../public/icon/sale-report.png";
import product from "../../public/icon/medicine.png";
import buy from "../../public/icon/buy-button.png";
import report from "../../public/icon/report.png";
import stock from "../../public/icon/in-stock.png";

export default function Home() {
  const isUserLogin = isUserExist();

  if (!isUserLogin) {
    redirect("/login");
  }

  const items = [
    {
      img: dashboard,
      text: "Dashboard",
      link: "/user/dashboard",
      status: "active",
    },
    { img: accounts, text: "Accounts", link: "/user/expense", status: "active" },
    { img: customer, text: "Customer", link: "/user/customer", status: "active" },
    { img: product, text: "Producct", link: "/user/product", status: "active" },
    { img: stock, text: "Stock", link: "/user/stock", status: "active" },
    { img: pos, text: "POS", link: "/user/pos", status: "active" },
    { img: saleReport, text: "Sales History", link: "/user/order", status: "active" },
    { img: buy, text: "Purchase", link: "/user/purchase", status: "active" },
    { img: supplier, text: "Suppliers", link: "/user/supplier", status: "active" },
    { img: category, text: "Category", link: "/user/category", status: "active" },
    { img: brand, text: "Brand", link: "/user/brand", status: "active" },
    { img: report, text: "Reports", link: "/user/reports-&-printing", status: "active" },
    {
      img: helpDesk,
      text: "Support",
      link: "/user/support",
      status: "active",
    },
    { img: invoice, text: "Print invoice", link: "/user/print-invoice", status: "active" },
    {
      img: user,
      text: "User Profile",
      link: "/user/profile",
      status: "active",
    },

    // Add more items as needed
  ];

  // Sorting alphabetically based on the 'text' property
  const sortedItems = items.sort((a, b) => a.text.localeCompare(b.text));

  return (
    <main className="min-h-screen flex justify-between flex-col bg-zinc-100">
      <div className="w-full">
        <Header />
      </div>
      <div className="container mx-auto  md:p-6 p-4 max-w-6xl  my-4">
        <div className="grid lg xl:grid-cols-5 md:grid-cols-4 grid-cols-3 2xl:gap-4 gap-3">
          {sortedItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              title={
                item.status === "deactive"
                  ? "Please contact sofware provider to active this module"
                  : ""
              }
            >
              <div
                className={`text-center py-5 grid place-items-center rounded-full group bg-white hover:shadow-lg border  ${item.status === "deactive" ? "bg-gray-200 opacity-50" : ""
                  }`}
              >
                <div>
                  <div className="2xl:w-20 2xl:h-20 md:w-16 md:h-16 w-12 h-12 group-hover:scale-110 transition-all rounded-full grid place-items-center mx-auto ">
                    <Image src={item.img} alt="icon" className="mx-auto" />
                  </div>
                  <p className="mt-2 text-textPrimary 2xl:text-base md:text-sm text-xs font-bold  text-nowrap overflow-clip">
                    {item.text}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer className="text-center pb-5 pt-10 md:text-base">
        Powered By <a target="blank" className="underline italic text-primary" href={process.env.NEXT_PUBLIC_POWERED_BY_LINK} >{process.env.NEXT_PUBLIC_POWERED_BY}</a>
      </footer>
    </main>
  );
}
