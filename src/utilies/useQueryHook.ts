import { QueryFunction, UseQueryResult, useQuery, } from "react-query";
import request from "./request";


export const useQueryHook = (key: string, queryFn:  Promise<any>) : UseQueryResult => useQuery({
      queryKey: [key],
        queryFn: () => queryFn,
        staleTime: Infinity,
        // enabled: false
        retry: 3 // Will retry failed requests 3 times before displaying an error
        // Refetch the data every second
        //   refetchInterval: intervalMs
})

export default class QueryHook  {
  private static retry?: number = 3;
  private static staleTime?: number = Infinity;

  constructor() {
  }
  

  public static queryList(key: string, cb: Promise<any> ) : UseQueryResult {

    return useQuery({
      queryKey: [key],
      queryFn: () => cb,
      staleTime: this.staleTime,
      retry : this.retry,
    })
  }

}