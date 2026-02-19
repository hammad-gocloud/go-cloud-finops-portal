import http from "@/src/api"
import { useQuery } from "@tanstack/react-query"

const useGetOrganizationsByTeam = (teamId?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["teamOrganizations", teamId], 
    queryFn: () =>
      http.api.organizationControllerFindAll({
        teamId: teamId,
      }),
    enabled: !!teamId, 
  })

  return { teamOrganizations: data, isLoading }
}

export default useGetOrganizationsByTeam
