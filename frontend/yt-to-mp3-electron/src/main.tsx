import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { HashRouter } from "react-router-dom";
import { AudioQueueProvider } from "./context/AudioQueueContext";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AudioQueueProvider>
          <App />
        </AudioQueueProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);
