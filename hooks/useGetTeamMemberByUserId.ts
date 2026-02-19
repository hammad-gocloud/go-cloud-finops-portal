import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeamMemberByUserId = (userId?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["team-member", userId],
    queryFn: () => http.api.teamMemberControllerFindByUser(userId as number),
    enabled: !!userId, // Only run query if teamId is provided
  });

  return { teamMember: data, isLoading };
};

export default useGetTeamMemberByUserId;