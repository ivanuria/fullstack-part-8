import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from './theme'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
