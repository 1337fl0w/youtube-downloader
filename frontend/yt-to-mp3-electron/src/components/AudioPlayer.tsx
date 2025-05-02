import { Box, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
// import { useAudioQueue } from "../hooks/useAudioQueue";

export default function AudioPlayer() {
    // const { playQueue, pauseQueue, isPlaying } = useAudioQueue();

    /*     const togglePlayback = () => {
            if (isPlaying) {
                pauseQueue();
            } else {
                playQueue();
            }
        }; */

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                bgcolor: "#1e1e1e",
                color: "white",
                padding: 2,
                borderTop: "1px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1300, // stays above other content
            }}
        >
            <Typography variant="body1" sx={{ ml: 2 }}>
                Now Playing: (placeholder)
            </Typography>
            <Box>
                {/* <IconButton color="inherit" onClick={togglePlayback}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton> */}
            </Box>
        </Box>
    );
}
