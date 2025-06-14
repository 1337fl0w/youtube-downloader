import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    CircularProgress,
    Divider,
    IconButton,
    Typography,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Song } from '../models/song';
import { useAudioQueue } from '../context/AudioQueueContext';

export default function PlaylistPage() {
    const { playlistName } = useParams();
    const navigate = useNavigate();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const {
        addPlaylistToQueue,
    } = useAudioQueue();

    useEffect(() => {
        const fetchMp3Files = async () => {
            const result = await window.ipcRenderer.invoke("get-mp3-files", playlistName);
            if (result.success) {
                setSongs(result.songs);
            } else {
                setError(result.message);
            }
            setLoading(false);
        };

        fetchMp3Files();
    }, [playlistName]);

    // Handle click on a song to add the entire playlist and set the current index
    const handleSongClick = async (songIndex: number) => {
        if (playlistName) {
            const success = await addPlaylistToQueue(playlistName, songIndex); // Pass songIndex to set the currentIndex
            setSnackbarSeverity(success ? 'success' : 'error');
            setSnackbarMessage(success ? 'Playlist added to queue!' : 'Failed to add playlist to queue.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ padding: 4, marginTop: '96px', position: 'relative', minHeight: 'calc(100vh - 96px)', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <IconButton onClick={() => navigate('/player')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ marginLeft: 1, flexGrow: 1 }}>
                    {playlistName}
                </Typography>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Box>{error}</Box>
            ) : (
                <Box sx={{ overflowY: 'hidden' }}>
                    <List>
                        {songs.length > 0 ? (
                            songs.map((song, index) => (
                                <div key={song.filePath}>
                                    <Divider />
                                    <ListItem
                                        disablePadding
                                        sx={{
                                            '&:hover .index': {
                                                display: 'none',
                                            },
                                            '&:hover .play-button': {
                                                display: 'inline-flex',
                                            },
                                        }}
                                    >
                                        <ListItemButton onClick={() => handleSongClick(index)}>
                                            <ListItemIcon>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography
                                                        className="index"
                                                        sx={{
                                                            width: 24,
                                                            textAlign: 'center',
                                                            color: '#ccc',
                                                            marginRight: 2,
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Typography>
                                                    <PlayArrowIcon
                                                        className="play-button"
                                                        sx={{
                                                            display: 'none',
                                                            color: '#1976d2',
                                                            marginRight: 2,
                                                        }}
                                                    />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{ color: '#ffffff' }}
                                                primary={song.name}
                                                secondary={song.length}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        ) : (
                            <Box>No MP3 files found.</Box>
                        )}
                    </List>
                </Box>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
