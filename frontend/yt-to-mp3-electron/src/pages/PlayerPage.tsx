import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip,
    Fab,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';
import { Playlist } from '../models/playlist';
import { useAudioQueue } from '../hooks/useAudioQueue';

export default function PlayerPage() {
    const [showDialog, setShowDialog] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [error, setError] = useState('');
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {
        clearQueue,
        setIsPlaying,
        addPlaylistToQueue
    } = useAudioQueue();

    const handlePlaybuttonClicked = async (playlistName: string) => {
        setIsPlaying(false);
        clearQueue();
        addPlaylistToQueue(playlistName);
        setIsPlaying(true);
        console.log('Playing playlist:', playlistName);
    }

    const fetchPlaylists = async () => {
        const result = await window.ipcRenderer.invoke("get-playlists");
        if (result.success) {
            setPlaylists(result.playlists);
        } else {
            setError(result.message);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const createPlaylist = async () => {
        const result = await window.ipcRenderer.invoke('create-playlist', playlistName);
        if (result.success) {
            setShowDialog(false);
            setPlaylistName('');
            setError('');
            fetchPlaylists();
        } else {
            setError(result.message);
        }
    };

    const deletePlaylist = async (name: string) => {
        const result = await window.ipcRenderer.invoke('delete-playlist', name);
        if (result.success) {
            fetchPlaylists();
        } else {
            alert(result.message);
        }
    };

    return (
        <Box sx={{ padding: 4, marginTop: '96px', position: 'relative' }}>
            {/* Display playlists */}
            <List>
                {playlists.map((playlist) => (
                    <div key={playlist.name}>
                        <Divider />
                        <ListItem
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => deletePlaylist(playlist.name)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                            sx={{
                                '&:hover .folder-icon': {
                                    display: 'none',
                                },
                                '&:hover .play-button': {
                                    display: 'inline-flex',
                                },
                            }}
                        >
                            <ListItemButton component={Link} to={`/playlist/${playlist.name}`}>
                                <ListItemIcon>
                                    <FolderIcon className="folder-icon" />
                                    <PlayArrowIcon
                                        onClick={() => handlePlaybuttonClicked(playlist.name)}
                                        className="play-button"
                                        sx={{
                                            display: 'none',
                                            color: '#1976d2',
                                            marginRight: 2,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={playlist.name}
                                    secondary={`Songs: ${playlist.songs.length} • Length: ${playlist.totalLength}`}
                                />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>

            {/* Floating Action Button */}
            <Tooltip title="Add Playlist" placement="left">
                <Fab
                    color="primary"
                    onClick={() => setShowDialog(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 96,
                        right: 24,
                        zIndex: 1000,
                    }}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>

            {/* Dialog for creating playlist */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogTitle>New Playlist</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Playlist Name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        margin="dense"
                        error={!!error}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={createPlaylist} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
