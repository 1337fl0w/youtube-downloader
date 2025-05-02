import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import { parseFile } from "music-metadata";
import { QueueItem } from "../src/models/queueItem";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

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

// Add playlist to queue
ipcMain.handle(
  "add-playlist-to-queue",
  async (_event, playlistName: string) => {
    const playlistPath = path.join(playlistsDir, playlistName);

    try {
      const files = fs
        .readdirSync(playlistPath)
        .filter((file) => path.extname(file).toLowerCase() === ".mp3");

      const queueItems: QueueItem[] = [];

      for (const file of files) {
        const filePath = path.join(playlistPath, file);
        const stats = fs.statSync(filePath);
        let length = "Unknown";

        try {
          const metadata = await parseFile(filePath);
          const duration = metadata.format.duration ?? 0;
          const min = Math.floor(duration / 60);
          const sec = Math.round(duration % 60);
          length = `${min}:${sec.toString().padStart(2, "0")}`;
        } catch {}

        queueItems.push({
          fileName: file,
          fileSize: stats.size,
          fileLocation: filePath,
          audioLength: length,
        });
      }

      return { success: true, items: queueItems };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
);

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
  startBackendServer();
  createWindow();
});
