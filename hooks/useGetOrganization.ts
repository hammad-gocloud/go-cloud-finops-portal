import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetOrganization = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => http.api.organizationControllerFindOne(id!),
    enabled: !!id, // <- only runs query if id exists
  });

  return { organization: data, isLoading };
};

export default useGetOrganization;
