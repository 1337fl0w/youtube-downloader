import { useState } from "react";
import axios from "axios";

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (!apiUrl) {
    console.error("API URL is not defined.");
    return {
      isDownloading,
      error,
      downloadFile: () => {},
      downloadPlaylist: () => {},
    };
  }

  const downloadFile = async (url: string) => {
    setIsDownloading(true);
    setError("");

    try {
      const response = await axios.post(
        `${apiUrl}/Download`,
        { videoUrl: url },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const urlObject = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObject;
      a.download = "download.mp3";
      a.click();
      window.URL.revokeObjectURL(urlObject);
    } catch (err) {
      console.error(err);
      setError("Failed to download video.");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPlaylist = async (url: string) => {
    setIsDownloading(true);
    setError("");

    try {
      const response = await axios.post(
        `${apiUrl}/DownloadPlaylist`,
        { playlistUrl: url },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const urlObject = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObject;
      a.download = "playlist.zip";
      a.click();
      window.URL.revokeObjectURL(urlObject);
    } catch (err) {
      console.error(err);
      setError("Failed to download playlist.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, error, downloadFile, downloadPlaylist };
};
