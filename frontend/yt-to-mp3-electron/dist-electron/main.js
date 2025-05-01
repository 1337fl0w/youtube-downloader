import { app as n, BrowserWindow as r } from "electron";
import { fileURLToPath as p } from "node:url";
import e from "node:path";
import { spawn as d } from "node:child_process";
const t = e.dirname(p(import.meta.url));
process.env.APP_ROOT = e.join(t, "..");
const s = process.env.VITE_DEV_SERVER_URL, w = e.join(process.env.APP_ROOT, "dist-electron"), i = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? e.join(process.env.APP_ROOT, "public") : i;
let o;
function l() {
  const a = e.join(
    n.isPackaged ? e.join(process.resourcesPath, "app", "backend") : e.join(t, "..", "backend"),
    "yt-to-mp3-server.exe"
  );
  d(a, [], {
    detached: !0,
    stdio: "ignore"
  }).unref();
}
function c() {
  o = new r({
    icon: e.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: e.join(t, "preload.mjs")
    }
  }), o.webContents.openDevTools(), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? o.loadURL(s) : o.loadFile(e.join(i, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
n.whenReady().then(() => {
  l(), c();
});
export {
  w as MAIN_DIST,
  i as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
