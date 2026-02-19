
import http from "@/src/api";
import { useQuery } from "@tanstack/react-query";

const useGetTeam = (id:string | any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["team",id],
    queryFn: () => http.api.teamControllerFindOne(id)
  });

  return { team: data, isLoading };
};

export default useGetTeam;
