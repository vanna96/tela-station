import React from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "react-query";
import { CookiesProvider } from "react-cookie";
import Router from "./routes";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import {
  ThemContextProps,
  ThemeContext,
  useThemeContext,
} from "./contexts/index";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthorizationProvider } from "./contexts/useAuthorizationContext";

const queryClient = new QueryClient();
const sessionStoragePersistor = createWebStoragePersistor({
  storage: window.sessionStorage,
});

persistQueryClient({
  queryClient,
  persistor: sessionStoragePersistor,
});
let theme = createTheme({
  palette: {
    primary: {
      main: "#15803d",
      // main: "#166534",
    },
    secondary: {
      main: "#ca8a04",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
  typography: {
    fontFamily: `"Content","Hanuman","Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const App = () => {
  const myContextValue = useThemeContext();

  React.useEffect(() => {
    myContextValue.setTheme(localStorage.getItem("theme") as ThemContextProps);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthorizationProvider>
        <QueryClientProvider client={queryClient}>
          <CookiesProvider>
            <ThemeContext.Provider value={myContextValue}>
              <Router />
            </ThemeContext.Provider>
          </CookiesProvider>
        </QueryClientProvider>
      </AuthorizationProvider>
    </ThemeProvider>
  );
};

export default App;
