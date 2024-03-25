
import { QueryOptionAPI } from "@/lib/filter_type";
import { queryOptionParser } from "@/lib/utils";
import request, { url } from "@/utilies/request";
import React, { useMemo } from "react";
import { useQuery } from "react-query";

const defaultQuery: QueryOptionAPI = {
  skip: 0,
  top: 10,
  orderby: "U_SourceDocEntry desc",
} as const;

const initialState = { ...defaultQuery };

type ActionQueryParam = {
  type: keyof QueryOptionAPI | "all";
  value?: string | number | QueryOptionAPI;
};

function reducer(state: QueryOptionAPI, action: ActionQueryParam) {
  switch (action.type) {
    case "skip":
      return { ...state, skip: action.value } as QueryOptionAPI;
    case "orderby":
      return { ...state, orderby: action.value } as QueryOptionAPI;
    case "filter":
      return { ...state, filter: action.value } as QueryOptionAPI;
    case "top":
      return { ...state, top: action.value } as QueryOptionAPI;
    case "all":
      return { ...(action.value as QueryOptionAPI) } as QueryOptionAPI;
    default:
      return state;
  }
}

const keyData = "TLTR_MDOCS";
const keyCount = "TLTR_MDOCS-COUNT";

export const UseTRModalListHook = (pagination: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const filters = useMemo(() => {
    return {
      ...state,
      skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize),
      top: pagination?.pageSize ?? 10,
    } as QueryOptionAPI;
  }, [pagination, state]);

  const dataQuery = useQuery({
    queryKey: [keyData + filters.skip, filters],
    queryFn: () =>
      request("GET", `/sml.svc/TLTR_MDOCS?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });
  const countQuery = useQuery({
    queryKey: [keyCount + filters.skip, filters],
    queryFn: () =>
      request(
        "GET",
        `/sml.svc/TLTR_MDOCS/$count?${queryOptionParser(filters)}`
      ),
    refetchOnWindowFocus: false,
  });

  const data: any[] = React.useMemo(
    () => (dataQuery?.data as any)?.data?.value ?? [],
    [dataQuery]
  );
  const totalRecords: number = React.useMemo(
    () => (countQuery?.data as any)?.data ?? 0,
    [countQuery]
  );

  const refetchData = async () => {
    dispatch({ type: "all", value: defaultQuery });
    dataQuery.refetch();
    countQuery.refetch();
  };

  const setFilter = (value: string) => {
    dispatch({ type: "filter", value });
  };
  
  const setSort = (value: string) => {
    dispatch({ type: "orderby", value });
  };

  const loading: boolean = React.useMemo(() => {
    return dataQuery.isFetching || countQuery.isFetching;
  }, [dataQuery.isFetching, countQuery.isFetching]);

  return {
    data,
    totalRecords,
    loading,
    state,
    setFilter,
    setSort,
    refetchData,
    countQuery,
    filters
  };
};
