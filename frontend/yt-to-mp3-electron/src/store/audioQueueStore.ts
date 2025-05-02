import { create } from "zustand";
import { Song } from "../models/song";

interface AudioQueueState {
  isPlaying: boolean;
  queue: Song[];
  currentSong: Song | null;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (songs: Song[]) => void;
  setCurrentSong: (song: Song | null) => void;
  playQueue: () => Promise<void>;
  pauseQueue: () => Promise<void>;
  addSongToQueue: (song: Song) => Promise<void>;
  addPlaylistToQueue: (playlistName: string) => Promise<void>;
  clearQueue: () => void;
}

export const useAudioQueueStore = create<AudioQueueState>((set, get) => ({
  isPlaying: false,
  queue: [],
  currentSong: null,

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQueue: (songs) => set({ queue: songs }),
  setCurrentSong: (song) => set({ currentSong: song }),

  playQueue: async () => {
    const currentQueue = await window.ipcRenderer.invoke("get-current-queue");
    const song = await window.ipcRenderer.invoke("get-current-song");
    set({ queue: currentQueue, currentSong: song });
    await window.ipcRenderer.invoke("play-queue", currentQueue);
    set({ isPlaying: true });
  },

  pauseQueue: async () => {
    set({ isPlaying: false });
    await window.ipcRenderer.invoke("pause-queue");
  },

  addSongToQueue: async (song) => {
    const newQueue = [...get().queue, song];
    set({ queue: newQueue });
    await window.ipcRenderer.invoke("add-song-to-queue", song);
  },

  addPlaylistToQueue: async (playlistName) => {
    const { success, songs } = await window.ipcRenderer.invoke(
      "get-mp3-files",
      playlistName
    );
    if (success) {
      for (const song of songs) {
        await get().addSongToQueue(song);
      }
      await get().playQueue();
    }
  },

  clearQueue: () => set({ queue: [], currentSong: null }),
}));
