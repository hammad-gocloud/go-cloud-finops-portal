
import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetOrganizations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => http.api.organizationControllerFindAll()
  });

  return { organizations: data, isLoading };
};

export default useGetOrganizations;
