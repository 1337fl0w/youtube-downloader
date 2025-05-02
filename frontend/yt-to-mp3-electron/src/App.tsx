import { Route, Routes, Link } from "react-router-dom";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage"; // Import the new page
import { AppBar, Toolbar, Typography, Button, Box, GlobalStyles } from "@mui/material";
import PlayerPage from "./pages/PlayerPage";
import PlaylistPage from "./pages/PlaylistPage";
import AudioPlayer from "./components/AudioPlayer";

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
            <Button color="inherit" component={Link} to="/">
              Download
            </Button>
            <Button color="inherit" component={Link} to="/player">
              Player
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/terms">
              Terms & Conditions
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: 4, marginBottom: '160px' }}>
          <Routes>
            <Route path="/" element={<DownloadPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/playlist/:playlistName" element={<PlaylistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
          </Routes>
        </Box>
        <AudioPlayer />
      </Box>
    </>
  );
}

export default App;
