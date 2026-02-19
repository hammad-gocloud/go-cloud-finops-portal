import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeamsByOrganization = (organizationId?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizationTeams", organizationId],
    queryFn: async () => {
      const teams = await http.api.teamControllerFindAll();
      return (teams || []).filter((t: any) => t?.organizationId === organizationId);
    },
    enabled: !!organizationId,
  });

  return { organizationTeams: data, isLoading };
};

export default useGetTeamsByOrganization;