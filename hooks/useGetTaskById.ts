import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetTaskById = (taskId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => http.api.taskControllerFindOne(taskId)
  });

  return { task: data, isLoading };
};

export default useGetTaskById;