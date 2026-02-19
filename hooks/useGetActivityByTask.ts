
import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetActivityByTask = (id:string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["activity",id],
    queryFn: () => http.api.taskActivityControllerFindByTask(id)
  });

  return { activity: data, isLoading, refetch };
};

export default useGetActivityByTask;
