import { Route, Routes, Link } from "react-router-dom";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage"; // Import the new page
import { AppBar, Toolbar, Typography, Button, Box, GlobalStyles } from "@mui/material";

function App() {
  return (
    <>
      <GlobalStyles
        styles={{
          "::-webkit-scrollbar": {
            width: "10px",
          },
          "::-webkit-scrollbar-track": {
            background: "#1e1e1e",
            borderRadius: "5px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#555",
            borderRadius: "5px",
            border: "2px solid #1e1e1e",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#777",
          },
        }}
      />
      <Box sx={{
        bgcolor: "#121212",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
      }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SoundFlare
            </Typography>
            <Button color="inherit" component={Link} to="/" onClick={() => console.log("download button clicked")}>
              Download
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/terms">
              Terms & Conditions
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: 4 }}>
          <Routes>
            <Route path="/" element={<DownloadPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} /> {/* Add the route here */}
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
