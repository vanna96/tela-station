import React from 'react';
import { createContext, useState } from 'react';
export type Role = "UG001" | "UG002" | "UG003" | "UG004";

export type UserServiceType = {
    InternalKey?: number;
    UserCode?: string;
    UserName?: string;
    SuperUser?: string;
    eMail?: string;
    MobilePhoneNumber?: string;
    Branch?: number;
    Department?: number;
    U_tl_user_autho?: Role | undefined;
    UserBranchAssignment?: UserBranchAssignment[];
};

export type UserBranchAssignment = {
    UserCode: string;
    BPLID: number;
};


export type AuthorizationContextProp = {
    authorization?: UserServiceType,
    onSetAutorization?: (value: UserServiceType) => void,
    loading: boolean,
    onRemoveAutorization?: () => void,
    getRoleCode?: Role | undefined,
}

const AuthorizationContext = createContext<AuthorizationContextProp>({ loading: false });

const AuthorizationProvider = ({ children }: { children?: React.ReactNode }) => {
    const [authorization, setAuthorization] = useState<UserServiceType>({});
    const [loading, setLoading] = useState(true);

    const onSetAutorization = (auth: UserServiceType) => {

        setAuthorization(auth);
        setLoading(false)
    };


    const onRemoveAutorization = () => {
        setLoading(true);
        setAuthorization({});
    }


    const getRoleCode: Role | undefined = React.useMemo(() => {
        return authorization?.U_tl_user_autho;
    }, [authorization])


    return (
        <AuthorizationContext.Provider value={{ authorization, onSetAutorization, loading, onRemoveAutorization, getRoleCode }}>
            {children}
        </AuthorizationContext.Provider>
    );
};

export { AuthorizationContext, AuthorizationProvider };