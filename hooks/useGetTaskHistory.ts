import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTaskHistory = (id: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["task-history", id],
    queryFn: () => http.api.taskControllerGetTaskHistory(id),
  });

  return { history: data, isLoading, refetch };
};

export default useGetTaskHistory;
