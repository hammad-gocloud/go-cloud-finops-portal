import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useUploadOrganizationMedia() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      organizationId,
      files,
    }: {
      organizationId: number;
      files: File[];
    }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("folder", "organization-gallery");

      // ✅ Get token from localStorage
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : undefined;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${organizationId}/gallery`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }), // ✅ Send token if available
          },
        }
      );

      return response.data;
    },
    onSuccess: (_, { organizationId }) => {
      // ✅ Refresh organization media cache
      queryClient.invalidateQueries({
        queryKey: ["organization-media", organizationId],
      });
    },
  });

  return mutation;
}
