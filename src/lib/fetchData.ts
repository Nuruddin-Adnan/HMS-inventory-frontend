import toastError from "@/helpers/toastError";
import toastSuccess from "@/helpers/toastSuccess";

export interface IGenericErrorMessage {
  path?: string;
  message: string;
}

export interface IGenericErrorResponse {
  success: boolean;
  message: string;
  errorMessages: IGenericErrorMessage[];
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const fetchData = async (
  endpoint: string,
  options: any,
  notify: boolean | undefined = true,
  successNotify: boolean | undefined = true,
  errorNotify: boolean | undefined = true
) => {
  const url = `${BASE_URL}/${endpoint}`;

  if (!options.signal) {
    options.signal = AbortSignal.timeout(60000);
  }

  try {
    const response = await fetch(url, options);

    if (!notify) {
      if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
      }

      return response.json();
    }

    const result = await response.json();

    // Check if the response has a "success" path for error handling
    if ("success" in result && result.success === false) {
      const errorResponse: IGenericErrorResponse = result;

      // Extract and format error messages
      const errorMessageDetails = errorResponse.errorMessages.map(
        (errorMessage) =>
          `${errorMessage.path || "Unknown path"}: ${errorMessage.message}`
      );

      const errorMessage = ` ${errorMessageDetails.join(", ")}`;

      // Show error toast with detailed error messages
      if (errorNotify) {
        toastError(errorMessage);
      }
    } else if ("success" in result && result.success === true) {
      const successMessage = result.message || "Success!";
      if (successNotify) {
        toastSuccess(successMessage);
      }
    } else {
      // If the response doesn't have "success" path, throw a generic error
      const errorMessage = result.message || "Something went wrong";
      if (errorNotify) {
        toastError(errorMessage);
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};
