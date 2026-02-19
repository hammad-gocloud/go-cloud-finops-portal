
import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetOrganizationsByUser = (userId:number) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["organizations",userId],
    queryFn: () => http.api.organizationControllerFindByUser(userId)
  });

  return { organizations: data, isLoading, refetch };
};

export default useGetOrganizationsByUser;
