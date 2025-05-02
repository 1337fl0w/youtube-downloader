import { createContext, useContext, useRef, useState } from "react";
import { Queue } from "../models/queue";

const QUEUE_KEY = "audioQueue";

type AudioQueueContextType = {
    queue: Queue;
    loading: boolean;
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    addPlaylistToQueue: (playlistName: string, songIndex: number) => Promise<boolean>;
    clearQueue: () => void;
};

const defaultQueue: Queue = { items: [], isPlaying: false, currentIndex: 0 };

const AudioQueueContext = createContext<AudioQueueContextType | null>(null);

export const AudioQueueProvider = ({ children }: { children: React.ReactNode }) => {
    const [queue, setQueueState] = useState<Queue>(() => {
        const raw = localStorage.getItem(QUEUE_KEY);
        console.log("raw queue: ", raw);
        return raw ? JSON.parse(raw) : defaultQueue;
    });

    const [loading, setLoading] = useState(false);
    const audioRef = useRef(new Audio());

    const updateQueue = (updates: Partial<Queue>) => {
        const updated = { ...queue, ...updates };
        setQueueState(updated);
        console.log("Updated queue state:", updated);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    };

    const play = () => {
        const item = queue.items[queue.currentIndex];
        if (!item) return;
        audioRef.current.src = item.fileLocation;
        audioRef.current.play();
        updateQueue({ isPlaying: true });
    };

    const pause = () => {
        audioRef.current.pause();
        updateQueue({ isPlaying: false });
    };

    const next = () => {
        if (queue.currentIndex < queue.items.length - 1) {
            const newIndex = queue.currentIndex + 1;
            const item = queue.items[newIndex];
            audioRef.current.src = item.fileLocation;
            audioRef.current.play();
            updateQueue({ currentIndex: newIndex, isPlaying: true });
        }
    };

    const previous = () => {
        if (queue.currentIndex > 0) {
            const newIndex = queue.currentIndex - 1;
            const item = queue.items[newIndex];
            audioRef.current.src = item.fileLocation;
            audioRef.current.play();
            updateQueue({ currentIndex: newIndex, isPlaying: true });
        }
    };

    const addPlaylistToQueue = async (playlistName: string, songIndex: number): Promise<boolean> => {
        setLoading(true);
        clearQueue();
        try {
            const result = await window.ipcRenderer.invoke("add-playlist-to-queue", playlistName);
            if (result.success && Array.isArray(result.items)) {
                const newQueue = { items: result.items, isPlaying: true, currentIndex: songIndex }; // Set currentIndex to songIndex
                setQueueState(newQueue);
                localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const clearQueue = () => {
        localStorage.removeItem(QUEUE_KEY);
        audioRef.current.pause();
        setQueueState(defaultQueue);
    };

    return (
        <AudioQueueContext.Provider
            value={{ queue, loading, play, pause, next, previous, addPlaylistToQueue, clearQueue }}
        >
            {children}
        </AudioQueueContext.Provider>
    );
};

export const useAudioQueue = () => {
    const ctx = useContext(AudioQueueContext);
    if (!ctx) throw new Error("useAudioQueue must be used inside AudioQueueProvider");
    return ctx;
};
