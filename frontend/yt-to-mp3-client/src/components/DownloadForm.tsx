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

    const isPlaylistUrl = (input: string) => {
        return input.includes("playlist?list=");
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
                />
                <Button
                    variant="contained"
                    onClick={handleDownload}
                    disabled={isDownloading || !url}
                >
                    {isDownloading ? <CircularProgress size={24} /> : 'Download'}
                </Button>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
        </Container>
    );
}
