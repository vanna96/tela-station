
import { AuthorizationContext, GetUserRole, Role } from "@/contexts/useAuthorizationContext";
import { POSTTransporationOrder } from "../../type";
import { useCallback, useContext } from "react";

type TOAutorizationField = keyof POSTTransporationOrder | 'GET_DOCUMENT' | 'UPDATE_DOCUMENT';
// 
export const useTOAuthorizationField = () => {
    const { authorization } = useContext(AuthorizationContext);

    const getAuthorizationField = (field: TOAutorizationField) => {
        const role = authorization?.U_tl_user_autho;
        // 
        switch (field) {
            case 'U_Route':
            case 'U_BaseStation':
            case 'U_Driver':
            case 'TL_TO_EXPENSECollection':
            case 'U_FuelAmount':
            case 'U_FuelRemark':
                if (role?.includes(GetUserRole.ADMIN)) return false
                if (role?.includes(GetUserRole.LOGISTIC)) return false
                return true
            case 'GET_DOCUMENT':
                if (role?.includes(GetUserRole.ADMIN)) return false
                if (role?.includes(GetUserRole.WAREHOUSE)) return false
                return true
            default:
                return true
        }
    }

    return {
        getAuthorizationField
    }
}