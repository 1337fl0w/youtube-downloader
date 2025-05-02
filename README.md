# youtube-downloader

server build
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true

```
youtube-downloader
├─ backend
│  └─ yt-to-mp3-server
├─ frontend
│  └─ yt-to-mp3-electron
│     ├─ .eslintrc.cjs
│     ├─ backend
│     │  └─ win-x64
│     │     ├─ Tools
│     │     │  ├─ ffmpeg.exe
│     │     │  └─ yt-dlp.exe
│     │     └─ All needed DLL and .exe files
│     ├─ electron
│     │  ├─ electron-env.d.ts
│     │  ├─ main.ts
│     │  └─ preload.ts
│     ├─ electron-builder.json5
│     ├─ index.html
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ electron-vite.animate.svg
│     │  ├─ electron-vite.svg
│     │  └─ vite.svg
│     ├─ README.md
│     ├─ src
│     │  ├─ App.tsx
│     │  ├─ assets
│     │  │  └─ react.svg
│     │  ├─ components
│     │  │  └─ DownloadForm.tsx
│     │  ├─ hooks
│     │  │  └─ useDownload.ts
│     │  ├─ main.tsx
│     │  ├─ pages
│     │  │  ├─ AboutPage.tsx
│     │  │  ├─ DownloadPage.tsx
│     │  │  └─ TermsAndConditionsPage.tsx
│     │  └─ vite-env.d.ts
│     ├─ tsconfig.json
│     ├─ tsconfig.node.json
│     └─ vite.config.ts
└─ README.md

```
