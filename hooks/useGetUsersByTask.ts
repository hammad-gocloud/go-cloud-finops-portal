import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetUsersByTaskId = (taskId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks-user", taskId],
    queryFn: () => http.api.taskControllerFindUsersInTask(taskId),
  });

  return { users: data, isLoading };
};

export default useGetUsersByTaskId;
