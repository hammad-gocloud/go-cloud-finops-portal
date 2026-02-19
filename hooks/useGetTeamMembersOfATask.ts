import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeamMembersOfTask = (taskId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks-members", taskId],
    queryFn: () => http.api.taskControllerFindAllTeamMembersOfATask(taskId),
    enabled: !!taskId, // Only run query if teamId is provided
  });

  return { teamMembersOfTask: data, isLoading };
};

export default useGetTeamMembersOfTask;