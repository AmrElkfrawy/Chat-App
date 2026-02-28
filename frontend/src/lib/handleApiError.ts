import axios from "axios";
import toast from "react-hot-toast";

/**
 * Standardised error handler for Axios requests.
 * Shows the server-provided message when available, otherwise a fallback.
 */
export function handleApiError(error: unknown, fallback: string): void {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
  } else {
    toast.error("An unexpected error occurred, please try again.");
  }
}
