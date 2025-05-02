import { Box, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useAudioQueueStore } from "../store/audioQueueStore";
import { useEffect } from "react";

export default function AudioPlayer() {
    const { playQueue, pauseQueue, isPlaying, currentSong } = useAudioQueueStore();

    useEffect(() => {
        if (isPlaying && !currentSong) {
            console.warn("Playing started but currentSong is still null");
        }
        else {
            console.log("Current song:", currentSong);
        }
    }, [isPlaying, currentSong]);

    const togglePlayback = () => {
        isPlaying ? pauseQueue() : playQueue();
    };

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
                zIndex: 1300,
            }}
        >
            <Typography variant="body1" sx={{ ml: 2 }}>
                Now Playing: {currentSong ? currentSong.name : "No song selected"}
            </Typography>
            <Box>
                <IconButton color="inherit" onClick={togglePlayback}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
            </Box>
        </Box>
    );
}
