import { useQuery } from "@tanstack/react-query";
import http from "@/src/api";
import { Task } from "@/src/api/api";

const useGetUser= (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => http.api.userControllerFindOne(id),
    enabled:!!id,

  });


  return { user: data, isLoading };
};

export default useGetUser;
