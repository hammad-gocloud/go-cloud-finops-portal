import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetTasksByOrganization = (
  orgId: string | any,
  status: any,
  search: string,
  userId?: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", orgId, status, search],
    queryFn: () =>
      http.api.taskControllerFindByOrganization(orgId, {
        status: status,
        search: search,
        userId
      }),
  });

  return { TasksByOrganization: data, isLoading };
};

export default useGetTasksByOrganization;
