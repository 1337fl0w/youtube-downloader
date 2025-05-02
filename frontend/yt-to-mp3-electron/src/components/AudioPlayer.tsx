// components/AudioPlayer.tsx
import { Box, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useAudioQueue } from "../context/AudioQueueContext";
import { useEffect } from "react";

export default function AudioPlayer() {
    const { queue, play, pause, next, previous } = useAudioQueue();

    useEffect(() => {
        console.log("queue.isPlaying: ", queue.isPlaying);
    }, [queue.isPlaying]);

    const handlePlayPause = () => {
        queue.isPlaying ? pause() : play();
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
                Now Playing: {queue.items[queue.currentIndex]?.fileName ?? "(No song)"}
            </Typography>
            <Box>
                <IconButton color="inherit" onClick={previous}>
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handlePlayPause}>
                    {queue.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton color="inherit" onClick={next}>
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
