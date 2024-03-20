import { AuthorizationContext } from "@/contexts/useAuthorizationContext";
import request from "@/utilies/request";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

const getBranches = (ids: number[]) => {
    if (ids?.length === 0) return []

    const str = `${ids.reduce((p, c, index) => p + ` BPLID eq ${c} ${index === ids.length - 1 ? '' : 'or '}`, '')} `;
    return request('GET', `BusinessPlaces?$select=BPLID,BPLName,Address&$filter=${str}`).then((res: any) => res.data.value);
}


export const useGetBranchesAssignHook = () => {
    const { authorization } = useContext(AuthorizationContext);

    const ids: number[] = useMemo(() => {
        return authorization?.UserBranchAssignment?.map((e) => e.BPLID) ?? []
    }, [authorization?.UserBranchAssignment])

    const response = useQuery({ queryKey: [`brans_assinge_${authorization?.UserBranchAssignment?.length ?? 0}`], queryFn: () => getBranches(ids) })

    return response;
}