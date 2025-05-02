import { useState } from "react";
import { ipcRenderer } from "electron";
import { Song } from "../models/song";

export const useAudioQueue = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);

  const playQueue = async () => {
    setIsPlaying(true);
    console.log("Playing songs from the queue...", queue);

    ipcRenderer.send("play-queue", queue);
  };

  const pauseQueue = async () => {
    setIsPlaying(false);
    console.log("Paused queue...", queue);

    ipcRenderer.send("pause-queue");
  };

  const addSongToQueue = async (song: Song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
    console.log(`Added song to the queue: ${song.name}`);

    ipcRenderer.send("add-song-to-queue", song);
  };

  const addPlaylistToQueue = async (playlistName: string) => {
    try {
      const { success, songs } = await ipcRenderer.invoke(
        "get-mp3-files",
        playlistName
      );
      if (success) {
        setQueue((prevQueue) => [...prevQueue, ...songs]);
        console.log(`Added playlist to the queue: ${playlistName}`, queue);
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

    ipcRenderer.send("remove-song-from-queue", song);
  };

  const clearQueue = () => {
    setQueue([]);
    console.log("Cleared the queue...");

    ipcRenderer.send("clear-queue");
  };

  const helloWorld = () => {
    console.log("Hello World");
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
    helloWorld,
  };
};
