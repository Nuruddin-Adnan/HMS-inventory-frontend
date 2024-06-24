"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Bkash from "../../../../../public/bkash-logo.png";
import Image from "next/image";

export default function SupportPage() {
  return (
    <div className="grid place-items-center h-[calc(100vh-100px)]">
      <div className="lg:grid grid-cols-7 max-w-5xl w-full text-base">
        <div className="get-in-touch col-span-4 py-5">
          <div className="bg-white p-10 shadow-2xl">
            <h2 className="text-2xl mb-5">Get in touch</h2>
            <form className="grid gap-4">
              <Input placeholder="Name" className="p-2" />
              <Input placeholder="Subject" className="p-2" />
              <Textarea placeholder="Your Message" className="p-2" rows={7} />
              <Button variant="primary" className="justify-center">
                Send Message
              </Button>
            </form>
          </div>
        </div>
        <div className="bg-primary text-white col-span-3 p-10 rounded">
          <h2 className="text-2xl mb-5">Contact us</h2>
          <ul className="grid gap-7">
            <li className="flex gap-3">
              <div className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-full bg-white bg-opacity-10">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <p>
                <strong> Address:</strong> 237, South Pirerbag, Shere-E-Bangla
                Nagar, Dhaka-1207
              </p>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-full bg-white bg-opacity-10">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <p>
                <strong> Phone:</strong>{" "}
                <a href="tel:+8801300635567">+ 880 1300635567</a>
              </p>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-full bg-white bg-opacity-10">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <p>
                <strong> Email:</strong>{" "}
                <a href="mailto:info@medisoftit.com">info@medisoftit.com</a>
              </p>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-full bg-white bg-opacity-10">
                <GlobeAltIcon className="w-5 h-5" />
              </div>
              <p>
                <strong> Website:</strong>{" "}
                <a href="https://medisoftit.com/" target="_blank">
                  https://medisoftit.com/
                </a>
              </p>
            </li>
          </ul>
          <h2 className="text-2xl mb-5 mt-10">Billing</h2>
          <ul className="grid gap-7">
            <li className="flex gap-3 items-center">
              <div className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-full bg-white bg-opacity-10">
                <Image src={Bkash} alt="Blash logo" className="w-5" />
              </div>
              <p>
                <strong> Bkash:</strong> 01771117454
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
