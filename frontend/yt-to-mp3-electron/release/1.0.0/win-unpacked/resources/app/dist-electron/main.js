import { app as n, BrowserWindow as i } from "electron";
import { fileURLToPath as p } from "node:url";
import e from "node:path";
import { spawn as d } from "node:child_process";
const t = e.dirname(p(import.meta.url)), l = process.env.NODE_ENV === "development";
process.env.APP_ROOT = e.join(t, "..");
const s = process.env.VITE_DEV_SERVER_URL, E = e.join(process.env.APP_ROOT, "dist-electron"), r = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? e.join(process.env.APP_ROOT, "public") : r;
let o;
function m() {
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
  o = new i({
    icon: e.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: e.join(t, "preload.mjs"),
      webSecurity: !1
    }
  }), o.setMenu(null), l && o.webContents.openDevTools(), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? o.loadURL(s) : o.loadFile(e.join(r, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && c();
});
n.whenReady().then(() => {
  m(), c();
});
export {
  E as MAIN_DIST,
  r as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
