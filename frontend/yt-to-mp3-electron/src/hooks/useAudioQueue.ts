import { useState } from "react";
import { Song } from "../models/song";

export const useAudioQueue = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const playQueue = async () => {
    setIsPlaying(true);
    setQueue(await window.ipcRenderer.invoke("get-current-queue"));
    setCurrentSong(await window.ipcRenderer.invoke("get-current-song"));
    console.log("Playing songs from the queue...", queue);
    console.log("Current song...", currentSong);
    await window.ipcRenderer.invoke("play-queue", queue);
  };

  const pauseQueue = async () => {
    setIsPlaying(false);
    console.log("Paused queue...", queue);

    await window.ipcRenderer.invoke("pause-queue");
  };

  const addSongToQueue = async (song: Song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
    console.log(`Added song to the queue: ${song.name}`);

    await window.ipcRenderer.invoke("add-song-to-queue", song);
  };

  const addPlaylistToQueue = async (playlistName: string) => {
    try {
      const { success, songs } = await window.ipcRenderer.invoke(
        "get-mp3-files",
        playlistName
      );
      if (success) {
        for (const song of songs) {
          await addSongToQueue(song);
        }
        console.log(
          `Added songs from playlist to the queue: ${playlistName}`,
          songs
        );
        playQueue();
      } else {
        console.log(`Failed to add playlist: ${playlistName}`);
      }
    } catch (error) {
      console.error("Error adding playlist to queue:", error);
    }
  };

  const removeSongFromQueue = (song: Song) => {
    setQueue((prevQueue) => prevQueue.filter((item) => item !== song));
    console.log(`Removed song from the queue: ${song.name}`);

    window.ipcRenderer.invoke("remove-song-from-queue", song);
  };

  const clearQueue = () => {
    setQueue([]);
    console.log("Cleared the queue...");

    window.ipcRenderer.invoke("clear-queue");
  };

  return {
    playQueue,
    pauseQueue,
    addSongToQueue,
    addPlaylistToQueue,
    removeSongFromQueue,
    clearQueue,
    isPlaying,
    setIsPlaying,
    queue,
    currentSong,
  };
};
