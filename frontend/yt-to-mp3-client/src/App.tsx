import { Route, Routes, Link } from "react-router-dom";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", color: "white" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            YouTube MP3 Converter
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Download
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        <Routes>
          <Route path="/" element={<DownloadPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
