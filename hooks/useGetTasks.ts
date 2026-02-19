import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetTasks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => http.api.taskControllerFindAll()
  });

  return { tasks: data, isLoading };
};

export default useGetTasks;