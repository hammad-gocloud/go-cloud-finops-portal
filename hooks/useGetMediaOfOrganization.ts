import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetMediaOfOrganization = (id: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organization-media", id],
    queryFn: () =>
      http.api.organizationControllerGetMedia(id, {
        folder: "task-activities",
      }),
    enabled: !!id, // <- only runs query if id exists
  });

  return { organization: data, isLoading };
};

export default useGetMediaOfOrganization;
