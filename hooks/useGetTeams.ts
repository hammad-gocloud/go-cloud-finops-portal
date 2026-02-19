
import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeams = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => http.api.teamControllerFindAll()
  });

  return { teams: data, isLoading };
};

export default useGetTeams;
