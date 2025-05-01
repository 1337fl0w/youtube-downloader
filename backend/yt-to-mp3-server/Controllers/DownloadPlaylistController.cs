using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO.Compression;

namespace yt_to_mp3_server.Controllers;

[ApiController]
[Route("[controller]")]
public class DownloadPlaylistController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Download([FromBody] DownloadPlaylistRequest request)
    {
        var playlistUrl = request.PlaylistUrl;

        if (string.IsNullOrWhiteSpace(playlistUrl))
            return BadRequest("Playlist URL is required.");

        var toolsPath = Path.Combine(AppContext.BaseDirectory, "Tools");
        var ytDlpPath = Path.Combine(toolsPath, "yt-dlp.exe");
        var ffmpegPath = Path.Combine(toolsPath, "ffmpeg.exe");

        var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        var outputTemplate = Path.Combine(tempDir, "%(title)s.%(ext)s");
        Directory.CreateDirectory(tempDir);

        Console.WriteLine($"Temp directory: {tempDir}");
        Console.WriteLine($"Using yt-dlp at: {ytDlpPath}");

        var ytDlpArgs = $"-x --audio-format mp3 --ffmpeg-location \"{ffmpegPath}\" -o \"{outputTemplate}\" {playlistUrl}";

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = ytDlpPath,
                Arguments = ytDlpArgs,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            }
        };

        process.Start();

        string stdOut = await process.StandardOutput.ReadToEndAsync();
        string stdErr = await process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        Console.WriteLine("yt-dlp STDOUT:");
        Console.WriteLine(stdOut);
        Console.WriteLine("yt-dlp STDERR:");
        Console.WriteLine(stdErr);

        var mp3Files = Directory.GetFiles(tempDir, "*.mp3");
        if (mp3Files.Length == 0)
        {
            return StatusCode(500, "No MP3 files were created. Check the playlist URL and try again.");
        }

        var zipPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".zip");
        ZipFile.CreateFromDirectory(tempDir, zipPath);

        var stream = System.IO.File.OpenRead(zipPath);

        // Cleanup after the response
        Response.OnCompleted(() =>
        {
            try
            {
                stream.Dispose();
                System.IO.File.Delete(zipPath);
                Directory.Delete(tempDir, true);
                Console.WriteLine("Cleaned up temp files.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cleanup error: " + ex.Message);
            }
            return Task.CompletedTask;
        });

        return File(stream, "application/zip", "playlist_download.zip");
    }
}
