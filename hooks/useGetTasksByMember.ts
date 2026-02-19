import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetTasksByMember = (memberId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", memberId],
    queryFn: () => http.api.taskControllerFindByAssigneeMember(memberId),
    enabled: !!memberId, // Only run query if memberId is provided
  });

  return { tasksByMember: data, isLoading };
};

export default useGetTasksByMember;