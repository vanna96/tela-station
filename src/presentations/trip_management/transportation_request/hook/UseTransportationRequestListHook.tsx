import { exportDefaulExcelTemplate } from "@/lib/excel/export_excel";
import { Sheet } from "@/lib/excel/type";
import { QueryOptionAPI } from "@/lib/filter_type";
import { displayTextDate, queryOptionParser } from "@/lib/utils";
import request, { url } from "@/utilies/request";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";

const defaultQuery: QueryOptionAPI = {
  skip: 0,
  top: 10,
  orderby: "DocEntry desc",
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

const keyData = "transportation-request";
const keyCount = "transportation-request-count";

export const UseTransportationRequestListHook = (pagination: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [waiting, setwaiting] = React.useState(false);
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/BusinessPlaces?$select=BPLID, BPLName, Address`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });
  // console.log(branchAss);

  const emp: any = useQuery({
    queryKey: ["SalePerson"],
    queryFn: async () => {
      const response: any = await request("GET", `/SalesPersons`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });

  const filters = useMemo(() => {
    return {
      ...state,
      skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize),
      top: pagination?.pageSize ?? 10,
    } as QueryOptionAPI;
  }, [pagination, state]);

  const dataQuery = useQuery({
    queryKey: [keyData + filters.skip, filters],
    queryFn: () => request("GET", `/TL_TR?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });
  const countQuery = useQuery({
    queryKey: [keyCount + filters.skip, filters],
    queryFn: () =>
      request("GET", `/TL_TR/$count?${queryOptionParser(filters)}`),
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
    console.log(value);
    dispatch({ type: "filter", value });
  };

  const setSort = (value: string) => {
    dispatch({ type: "orderby", value });
  };

  const loading: boolean = React.useMemo(() => {
    return dataQuery.isFetching || countQuery.isFetching;
  }, [dataQuery.isFetching, countQuery.isFetching]);

  const exportExcelTemplate = useCallback(async () => {
    setwaiting(true);
    const query = { ...state } as QueryOptionAPI;

    delete query.top;
    delete query.skip;
    //
    const reponse: any = await request(
      "GET",
      `/TL_TR?${queryOptionParser(query)}`
    );

    const lists: string[][] = [];
    const reponseData: any[] = reponse?.data?.value ?? ([] as any[]);
    for (const invTR of reponseData) {
      lists.push([
        invTR.DocNum,
        branchAss?.data?.find((e: any) => e?.BPLID === invTR.U_Branch)?.BPLName,
        invTR.U_Terminal,
        emp?.data?.find((e: any) => e?.SalesEmployeeCode === invTR.U_Requester)
          ?.SalesEmployeeName,
        displayTextDate(invTR.U_RequestDate),
        invTR.Status === "O" ? "Open" : "Close",
      ]);
    }
    //
    const headers = [
      "Document Number",
      "Branch",
      "Terminal",
      "Requester",
      "Request Date",
      "Status",
    ];
    const sheet: Sheet = {
      filename: "Transportation Request",
      sheetName: "Transportation Request",
      header: {
        value: headers.map((e) => ({ value: e })),
        startCol: 1,
        startRow: 7,
      },
      body: {
        value: lists,
      },
    };
    await exportDefaulExcelTemplate(sheet);
    // setLoadingDialog(false);
    setwaiting(false);
  }, [state]);

  return {
    data,
    totalRecords,
    loading,
    state,
    setFilter,
    setSort,
    exportExcelTemplate,
    refetchData,
    waiting,
    countQuery,
  };
};
