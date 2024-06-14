"use client";

import cn from "@/lib/cn";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function Modal({
  title,
  titleClassName,
  className,
  children,
  openModal = false,
  closeBtn = true,
  closeBtnClassName,
  footerCloseBtn = false,
  footerCloseBtnText = "Got it, thanks!",
  footerCloseBtnClassName,
  footerCloseBtnPosition = "left",
  onCloseModal,
}: {
  title?: React.ReactNode | string;
  titleClassName?: string;
  className?: string;
  children: React.ReactNode | string;
  openModal: boolean;
  closeBtn?: boolean;
  closeBtnClassName?: string;
  footerCloseBtn?: boolean;
  footerCloseBtnText?: string;
  footerCloseBtnClassName?: string;
  footerCloseBtnPosition?: "right" | "left";
  onCloseModal: any;
}) {
  let [isOpen, setIsOpen] = useState(openModal);

  function closeModal() {
    setIsOpen(false);
    onCloseModal();
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 z-[99999]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-[99999]">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={cn(
                    "w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-5 sm:p-6 text-left align-middle shadow-xl transition-all",
                    className
                  )}
                >
                  <Dialog.Title
                    className={cn("flex gap-1 justify-between", titleClassName)}
                  >
                    <span>
                      {title && (
                        <div className="text-lg font-medium leading-6 text-gray-900  -mt-1">
                          {title}
                        </div>
                      )}
                    </span>
                    {closeBtn && (
                      <div>
                        <button
                          onClick={closeModal}
                          className={cn(
                            "focus:outline-none",
                            closeBtnClassName
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="rgba(0,0,0, 0.5)"
                          >
                            <path d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Dialog.Title>
                  <div>{children}</div>

                  {footerCloseBtn && (
                    <div
                      className={
                        footerCloseBtnPosition === "right"
                          ? "mt-4 text-end"
                          : "mt-4"
                      }
                    >
                      <button
                        type="button"
                        className={cn(
                          "inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                          footerCloseBtnClassName
                        )}
                        onClick={closeModal}
                      >
                        {footerCloseBtnText}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
