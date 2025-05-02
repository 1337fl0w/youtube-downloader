import { Box, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useState, useEffect } from "react";
import { useAudioQueue } from "../hooks/useAudioQueue";

export default function AudioPlayer() {
    const {
        getQueue,
        startPlayback,
        stopPlayback,
        nextSong,
        previousSong,
    } = useAudioQueue();

    const [isPlaying, setIsPlaying] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const queue = getQueue();
        setIsPlaying(queue.isPlaying);
        setTitle(queue.items[queue.currentIndex]?.fileName ?? "(No song)");
    }, [getQueue]);

    const handlePlayPause = () => {
        const queue = getQueue();
        if (queue.isPlaying) {
            stopPlayback();
            setIsPlaying(false);
        } else {
            startPlayback();
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        nextSong();
        const queue = getQueue();
        setTitle(queue.items[queue.currentIndex]?.fileName ?? "(No song)");
        setIsPlaying(true);
    };

    const handlePrevious = () => {
        previousSong();
        const queue = getQueue();
        setTitle(queue.items[queue.currentIndex]?.fileName ?? "(No song)");
        setIsPlaying(true);
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
                Now Playing: {title}
            </Typography>
            <Box>
                <IconButton color="inherit" onClick={handlePrevious}>
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handlePlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton color="inherit" onClick={handleNext}>
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
