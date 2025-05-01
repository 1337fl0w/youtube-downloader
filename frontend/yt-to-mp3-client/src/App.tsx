import { Route, Routes, Link } from "react-router-dom";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage"; // Import the new page
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", color: "white", overflowY: "auto" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SoundFlare
          </Typography>
          <Button color="inherit" component={Link} to="/">
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
  );
}

export default App;
