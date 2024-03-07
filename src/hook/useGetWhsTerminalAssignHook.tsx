import request from "@/utilies/request";
import { useMemo } from "react";
import { useQuery } from "react-query";

const getData = (query: string) => {
    return request('GET', `Warehouses?$select=WarehouseCode,WarehouseName,BusinessPlaceID,DefaultBin${query}`)
        .then((res: any) => res.data.value);
}

export const useGetWhsTerminalAssignHook = (terminalOnly = true) => {
    const query = useMemo(() => {
        if (!terminalOnly) return '';
        return `&$filter=U_tl_attn_ter eq 'Y'`;
    }, [terminalOnly])

    const response = useQuery({ queryKey: [`whs_terminals_${query}`], queryFn: () => getData(query) })
    return response;
}