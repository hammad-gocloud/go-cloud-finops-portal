"use client";

import { IErrorResponse } from "@/interfaces/IErrorResponse";
import { ISuccessResponse } from "@/interfaces/ISuccessResponse";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: IErrorResponse) => {
        const message =
          error.response?.data?.message || "An unexpected error occurred.";
        toast.error(message);
      },
      onSuccess: (data: unknown) => {
        const res = data as ISuccessResponse;
        const message = res?.message || "Operation completed successfully.";
        toast.success(message);
      },
    },
  },
});
