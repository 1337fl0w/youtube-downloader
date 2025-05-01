using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace yt_to_mp3_server.Controllers;

public class DownloadRequest
{
    public string VideoUrl { get; set; } = string.Empty;
}

[ApiController]
[Route("[controller]")]
public class DownloadController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Download([FromBody] DownloadRequest request)
    {
        var videoUrl = request.VideoUrl;

        if (string.IsNullOrWhiteSpace(videoUrl))
            return BadRequest("URL is required.");

        var toolsPath = Path.Combine(AppContext.BaseDirectory, "Tools");
        var ytDlpPath = Path.Combine(toolsPath, "yt-dlp.exe");
        var ffmpegPath = Path.Combine(toolsPath, "ffmpeg.exe");

        var tempFileName = Guid.NewGuid().ToString();
        var outputTemplate = Path.Combine(Path.GetTempPath(), tempFileName);
        var expectedMp3 = outputTemplate + ".mp3";

        Console.WriteLine($"Using yt-dlp at: {ytDlpPath}");
        Console.WriteLine($"Using ffmpeg at: {ffmpegPath}");
        Console.WriteLine($"Output template: {outputTemplate}.%(ext)s");
        Console.WriteLine($"Expected MP3 file: {expectedMp3}");

        var ytDlpArgs = $"-x --audio-format mp3 --ffmpeg-location \"{ffmpegPath}\" -o \"{outputTemplate}.%(ext)s\" {videoUrl}";

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

        if (!System.IO.File.Exists(expectedMp3))
        {
            return StatusCode(500, "Download failed. Output file not found.");
        }

        var stream = System.IO.File.OpenRead(expectedMp3);

        // Schedule the file to be deleted after the response is sent
        Response.OnCompleted(() =>
        {
            try
            {
                stream.Dispose(); // Ensure stream is closed before deletion
                System.IO.File.Delete(expectedMp3);
                Console.WriteLine("Temp file deleted: " + expectedMp3);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete temp file: {ex.Message}");
            }
            return Task.CompletedTask;
        });

        return File(stream, "audio/mpeg", "download.mp3");
    }
}
