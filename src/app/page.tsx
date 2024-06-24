import { isUserExist } from "@/lib/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import drugs from "../../public/icon/drugs.png";
import user from "../../public/icon/user.png";
import referral from "../../public/icon/referral.png";
import slip from "../../public/icon/slip.png";
import healthcare from "../../public/icon/healthcare.png";

import sampleCollection from "../../public/icon/smaple-collection.svg";
import billing from "../../public/icon/billing.svg";
import reportsAndPrintings from "../../public/icon/reports-and-printings.svg";
import admission from "../../public/icon/admission.svg";
import accounts from "../../public/icon/accounts.svg";
import testReportGeneration from "../../public/icon/test-report-generation.svg";
import patient from "../../public/icon/patient.svg";
import stethoscope from "../../public/icon/stethoscope.svg";
import hospital from "../../public/icon/hospital.png";
import xRay from "../../public/icon/x-ray.png";
import "core-js";

export default function Home() {
  const isUserLogin = isUserExist();

  if (!isUserLogin) {
    redirect("/login");
  }

  const items = [
    {
      img: drugs,
      text: "Dashboard",
      link: "/user/dashboard",
      status: "active",
    },
    { img: drugs, text: "Brand", link: "/", status: "active" },
    { img: drugs, text: "Product", link: "/", status: "active" },
    { img: drugs, text: "Stock", link: "/", status: "active" },
    { img: drugs, text: "Customer", link: "/", status: "active" },
    { img: billing, text: "POS", link: "/", status: "active" },
    { img: drugs, text: "Sales History", link: "/", status: "active" },
    { img: drugs, text: "Purchase", link: "/", status: "active" },
    { img: drugs, text: "Suppliers", link: "/", status: "active" },
    { img: drugs, text: "Category", link: "/", status: "active" },
    { img: reportsAndPrintings, text: "Reports", link: "/", status: "active" },
    { img: accounts, text: "Expenses", link: "/", status: "active" },
    {
      img: drugs,
      text: "Contact Support",
      link: "/user/support",
      status: "active",
    },
    { img: slip, text: "Print invoice", link: "/", status: "active" },
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
    <main className="home-page min-h-screen grid place-items-center">
      <div className="container mx-auto backdrop-blur bg-white bg-opacity-50 p-6 rounded-xl md:w-2/3 my-4">
        <div className="grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-4 gap-3">
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
                className={`text-center 2xl:px-4 px-2 2xl:py-7 py-5 shadow border border-zinc-200 rounded-lg group bg-white backdrop-blur hover:bg-cyan-500 ${
                  item.status === "deactive" ? "bg-gray-200 opacity-50" : ""
                }`}
              >
                <div className="2xl:w-20 2xl:h-20 w-16 h-16 rounded-full grid place-items-center mx-auto bg-primary bg-opacity-10 p-4 group-hover:bg-white group-hover:bg-opacity-100">
                  <Image src={item.img} alt="icon" className="mx-auto" />
                </div>
                <p className="mt-2 text-textPrimary 2xl:text-base font-bold group-hover:text-white text-nowrap overflow-clip">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
