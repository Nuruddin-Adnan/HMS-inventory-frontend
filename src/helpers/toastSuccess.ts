"use client";

import { toast } from "react-toastify"; // Show error toast with detailed error messages

export default function toastSuccess(errorMessage: any) {
  toast.success(errorMessage, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}
