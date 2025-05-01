import { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { useDownload } from '../hooks/useDownload';

export default function DownloadForm() {
    const [url, setUrl] = useState('');
    const { isDownloading, error, downloadFile, downloadPlaylist } = useDownload();

    // Regex for basic YouTube URL validation
    const isValidYouTubeUrl = (input: string) => {
        return /^https?:\/\/(www\.)?youtube\.com\/(watch\?v=|playlist\?list=)[\w-]+(&[\w=?-]*)*$/.test(input);
    };

    const isPlaylistUrl = (input: string) => {
        return input.includes("playlist?list=");
    };

    const getVideoId = (input: string) => {
        const match = input.match(/v=([\w-]+)/);
        return match ? match[1] : null;
    };

    const handleDownload = () => {
        if (isPlaylistUrl(url)) {
            downloadPlaylist(url);
            console.log("Downloading playlist...");
        } else {
            downloadFile(url);
            console.log("Downloading single video...");
        }
    };

    const isValid = isValidYouTubeUrl(url);
    const videoId = getVideoId(url);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                YouTube to MP3 Converter
            </Typography>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="YouTube URL"
                    fullWidth
                    variant="outlined"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    error={url.length > 0 && !isValid}
                    helperText={url.length > 0 && !isValid ? "Enter a valid YouTube video or playlist URL" : " "}
                    InputProps={{
                        endAdornment: (
                            <Button
                                variant="contained"
                                onClick={handleDownload}
                                disabled={!isValid || isDownloading}
                                sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 100 }}
                            >
                                {isDownloading ? <CircularProgress size={20} /> : 'Download'}
                            </Button>
                        ),
                    }}
                />

            </Box>

            {isValid && videoId && !isPlaylistUrl(url) && (
                <Box mb={2}>
                    <Box
                        sx={{
                            position: 'relative',
                            paddingTop: '56.25%', // 16:9 aspect ratio
                            mb: 2,
                        }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Box>
                </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}
        </Container>
    );
}
