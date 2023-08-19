import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours,
      refetchOnWindowFocus: false,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
  // maxAge: 1000 * 60 * 60 * 24,
  // buster: ""
});

export const QueryCacheProvider = ({ children }: any) => (
  <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
);
