import React from "react";
import Routing from "./routing";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ProvideAuth } from "./hooks/useAuth";
import ThemeProvider from "./theme"; // this now includes MUI ThemeProvider and CssBaseline

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProvideAuth>
        <ThemeProvider>
          <Routing />
        </ThemeProvider>
      </ProvideAuth>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
