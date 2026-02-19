import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeamMembers = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => http.api.teamMemberControllerFindByTeam(teamId),
    enabled: !!teamId, // Only run query if teamId is provided
  });

  return { teamMembers: data, isLoading };
};

export default useGetTeamMembers;