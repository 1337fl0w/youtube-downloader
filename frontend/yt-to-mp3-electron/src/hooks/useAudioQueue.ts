import { useRef, useState } from "react";
import { Queue } from "../models/queue";

const QUEUE_KEY = "audioQueue";

export const useAudioQueue = () => {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(new Audio());

  const getQueue = (): Queue => {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return { items: [], isPlaying: false, currentIndex: 0 };
    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed === "object" &&
        Array.isArray(parsed.items) &&
        typeof parsed.isPlaying === "boolean" &&
        typeof parsed.currentIndex === "number"
      ) {
        return parsed;
      }
    } catch {}
    return { items: [], isPlaying: false, currentIndex: 0 };
  };

  const setQueue = (queue: Queue) => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  const updateQueueState = (updates: Partial<Queue>) => {
    const queue = getQueue();
    const newQueue = { ...queue, ...updates };
    setQueue(newQueue);
    console.log("Updated queue state:", newQueue);
    return newQueue;
  };

  const startPlayback = () => {
    console.log("Starting playback");
    const queue = getQueue();
    const current = queue.items[queue.currentIndex];
    if (!current) return;

    audioRef.current.src = current.fileLocation;
    audioRef.current.play();
    updateQueueState({ isPlaying: true });
  };

  const stopPlayback = () => {
    audioRef.current.pause();
    updateQueueState({ isPlaying: false });
  };

  const nextSong = () => {
    const queue = getQueue();
    if (queue.currentIndex < queue.items.length - 1) {
      const newIndex = queue.currentIndex + 1;
      const nextItem = queue.items[newIndex];
      audioRef.current.src = nextItem.fileLocation;
      audioRef.current.play();
      updateQueueState({ currentIndex: newIndex, isPlaying: true });
    }
  };

  const previousSong = () => {
    const queue = getQueue();
    if (queue.currentIndex > 0) {
      const newIndex = queue.currentIndex - 1;
      const prevItem = queue.items[newIndex];
      audioRef.current.src = prevItem.fileLocation;
      audioRef.current.play();
      updateQueueState({ currentIndex: newIndex, isPlaying: true });
    }
  };

  const addPlaylistToQueue = async (playlistName: string): Promise<boolean> => {
    setLoading(true);
    clearQueue();
    try {
      const result = await window.ipcRenderer.invoke(
        "add-playlist-to-queue",
        playlistName
      );
      if (result.success && Array.isArray(result.items)) {
        setQueue({ items: result.items, isPlaying: false, currentIndex: 0 });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add playlist:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearQueue = () => {
    localStorage.removeItem(QUEUE_KEY);
    audioRef.current.pause();
  };

  return {
    addPlaylistToQueue,
    clearQueue,
    getQueue,
    startPlayback,
    stopPlayback,
    nextSong,
    previousSong,
    loading,
  };
};
