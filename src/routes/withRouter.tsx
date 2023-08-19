import { ComponentType } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export interface WithRouterProps<T = ReturnType<typeof useParams>> {
    history: {
        back: () => void;
        goBack: () => void;
        location: ReturnType<typeof useLocation>;
        push: (url: string, state?: any) => void;
    }
    location: ReturnType<typeof useLocation>;
    match: {
        params: T;
    };
    edit?: boolean,
    navigate: ReturnType<typeof useNavigate>;
    query?: any,
}

export const withRouter = <P extends object>(Component: ComponentType<P>) => {
    return (props: Omit<P, keyof WithRouterProps>) => {
        const location = useLocation();
        const match = { params: useParams() };
        const navigate = useNavigate();
        const queryClient = useQueryClient();

        const [cookies] = useCookies(['user']);

        const history = {
            back: () => navigate(-1),
            goBack: () => navigate(-1),
            location,

            push: (url: string, state?: any) => navigate(url, { state }),
            replace: (url: string, state?: any) => navigate(url, {
                replace: true,
                state
            }),

        };

        const query = {
            find: (key: string) => queryClient.getQueryData(key),
            get: (key: string) => queryClient.getQueryData(key),
            set: (key: any, data: any) => {
                queryClient.setQueryData(key, data)
            },
            mutation: (key: string, cb: any) => {
                return useMutation(cb, {
                    onSuccess: (data: any) => {
                        queryClient.setQueryData(key, (oldData: any) => {
                            return {
                                ...oldData,
                                data: [...oldData.data, data],
                            }
                        });
                    }
                })
            }
        };


        return (
            <Component
                history={history}
                location={location}
                match={match}
                navigate={navigate}
                query={query}
                user={cookies.user}
                {...props as P}
            />
        );
    };
};