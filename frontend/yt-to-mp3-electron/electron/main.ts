import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import { parseFile } from "music-metadata";
import { audioQueue } from "../src/models/audioQueue";
import { Song } from "../src/models/song";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

// Queue and playback management variables
let audioQueue: Song[] = [];
let isPlaying = false;
let currentSongIndex = 0;

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

// Define the playlists directory
const playlistsDir = path.join(process.env.APP_ROOT!, "playlists");

const audioQueueFilePath = path.join(process.env.APP_ROOT!, "audioQueue.json");

// Ensure the playlists directory exists
if (!fs.existsSync(playlistsDir)) {
  fs.mkdirSync(playlistsDir);
}

// Handle the create-playlist event
ipcMain.handle("create-playlist", async (_event, playlistName: string) => {
  const sanitized = playlistName.replace(/[^a-z0-9_\- ]/gi, "_"); // basic sanitization
  const newPlaylistPath = path.join(playlistsDir, sanitized);

  try {
    if (!fs.existsSync(newPlaylistPath)) {
      fs.mkdirSync(newPlaylistPath);
      return { success: true };
    } else {
      return { success: false, message: "Playlist already exists" };
    }
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

// Handle fetching playlists (directories)
ipcMain.handle("get-playlists", async () => {
  try {
    const playlistNames = fs.readdirSync(playlistsDir).filter((file) => {
      const filePath = path.join(playlistsDir, file);
      return fs.statSync(filePath).isDirectory();
    });

    const playlists = await Promise.all(
      playlistNames.map(async (name) => {
        const folderPath = path.join(playlistsDir, name);
        const files = fs
          .readdirSync(folderPath)
          .filter((file) => path.extname(file) === ".mp3");

        const songs = await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            let length = "Unknown";
            let durationSec = 0;

            try {
              const metadata = await parseFile(filePath);
              durationSec = metadata.format.duration || 0;
              const minutes = Math.floor(durationSec / 60);
              const seconds = Math.round(durationSec % 60);
              length = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            } catch {}

            return {
              name: file,
              filePath,
              length,
              fileSize: stats.size,
              durationSec,
            };
          })
        );

        const totalDuration = songs.reduce(
          (sum, song) => sum + (song.durationSec || 0),
          0
        );
        const minutes = Math.floor(totalDuration / 60);
        const seconds = Math.round(totalDuration % 60);
        const totalLength = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        return {
          name,
          songs,
          totalLength,
          totalSize: songs.reduce((sum, song) => sum + song.fileSize, 0),
        };
      })
    );

    return { success: true, playlists };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

// Handle fetching MP3 files inside a playlist
ipcMain.handle("get-mp3-files", async (_event, playlistName: string) => {
  const playlistPath = path.join(playlistsDir, playlistName);

  try {
    const files = fs
      .readdirSync(playlistPath)
      .filter((file) => path.extname(file).toLowerCase() === ".mp3");

    const songs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(playlistPath, file);
        const stats = fs.statSync(filePath);
        let length = "Unknown";

        try {
          const metadata = await parseFile(filePath);
          const durationSec = metadata.format.duration || 0;
          const minutes = Math.floor(durationSec / 60);
          const seconds = Math.round(durationSec % 60);
          length = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        } catch {
          // Ignore parse errors
        }

        return {
          name: file,
          filePath,
          length,
          fileSize: stats.size,
        };
      })
    );

    return { success: true, songs };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

// Handle deleting a playlist
ipcMain.handle("delete-playlist", async (_event, playlistName: string) => {
  const playlistPath = path.join(playlistsDir, playlistName);

  try {
    if (fs.existsSync(playlistPath)) {
      fs.rmSync(playlistPath, { recursive: true, force: true });
      return { success: true };
    } else {
      return { success: false, message: "Playlist does not exist" };
    }
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

// Load the audio queue from a JSON file
function loadAudioQueue(): Song[] {
  if (fs.existsSync(audioQueueFilePath)) {
    try {
      const data = fs.readFileSync(audioQueueFilePath, "utf-8");
      const parsedQueue = JSON.parse(data);
      return parsedQueue.songs || []; // Return the 'songs' array from the saved queue
    } catch (error) {
      console.error("Failed to load audio queue:", error);
      return []; // Return an empty queue if there's an error
    }
  }
  return []; // Return an empty queue if the file doesn't exist
}

// Save the audio queue to a JSON file
function saveAudioQueue(queue: Song[]): void {
  const queueData = { songs: queue };
  try {
    fs.writeFileSync(
      audioQueueFilePath,
      JSON.stringify(queueData, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to save audio queue:", error);
  }
}

// Handle playing the queue
ipcMain.handle("play-queue", () => {
  if (audioQueue.length === 0) {
    return { success: false, message: "Queue is empty." };
  }

  isPlaying = true;
  playNextSong();
  return { success: true };
});

// Handle pausing the queue
ipcMain.handle("pause-queue", () => {
  isPlaying = false;
  // Logic to pause the audio playback in the renderer
  return { success: true };
});

// Handle adding a song to the queue
ipcMain.handle("add-song-to-queue", (_event, songFilePath: string) => {
  audioQueue.push({ filePath: songFilePath } as Song); // Assuming Song type has a filePath
  saveAudioQueue(audioQueue); // Save the updated queue to file
  return { success: true, message: "Song added to queue." };
});

// Handle removing a song from the queue
ipcMain.handle("remove-song-from-queue", (_event, songFilePath: string) => {
  audioQueue = audioQueue.filter((song) => song.filePath !== songFilePath);
  saveAudioQueue(audioQueue); // Save the updated queue to file
  return { success: true, message: "Song removed from queue." };
});

// Handle clearing the queue
ipcMain.handle("clear-queue", () => {
  audioQueue = [];
  saveAudioQueue(audioQueue); // Save the cleared queue to file
  return { success: true, message: "Queue cleared." };
});

// Handle fetching the current audio queue
ipcMain.handle("get-current-queue", () => {
  return { success: true, audioQueue };
});

// Handle fetching the current song
ipcMain.handle("get-current-song", () => {
  const currentSong = audioQueue[currentSongIndex];
  return { success: true, currentSong };
});

// Function to play the next song
function playNextSong() {
  if (!isPlaying || currentSongIndex >= audioQueue.length) {
    return;
  }

  const currentSong = audioQueue[currentSongIndex];
  // Logic to start playing the current song
  console.log(`Now playing: ${currentSong.name}`);

  currentSongIndex++;

  // Automatically play the next song once the current one finishes
  // This can be hooked into the actual audio playback API
  setTimeout(() => {
    playNextSong();
  }, 3000); // Assuming 3 seconds per song, adjust based on actual song duration
}

// Start the backend server
function startBackendServer() {
  const backendPath = path.join(
    app.isPackaged
      ? path.join(process.resourcesPath, "app", "backend")
      : path.join(__dirname, "..", "backend"),
    "yt-to-mp3-server.exe"
  );

  const subprocess = spawn(backendPath, [], {
    detached: true,
    stdio: "ignore",
  });

  subprocess.unref();
}

// Create the Electron window
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webSecurity: false,
    },
  });
  win.setMenu(null);

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Initialize the app
app.whenReady().then(() => {
  audioQueue = loadAudioQueue();
  startBackendServer();
  createWindow();
});
