import { Container, Typography, Divider, Link } from "@mui/material";

export default function AboutPage() {
    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                About This App
            </Typography>

            <Typography variant="body1" paragraph>
                This web application allows you to convert YouTube videos and playlists into high-quality MP3 files.
                It's designed for simplicity, speed, and ease of use — whether you want to extract music, audio from
                lectures, or other content from your own YouTube videos.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
                ✨ Features
            </Typography>
            <Typography variant="body1" paragraph>
                - Convert individual videos to MP3 format<br />
                - Download full playlists as a ZIP archive of MP3 files<br />
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
                🔗 Example YouTube URLs
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Single Video:</strong>
            </Typography>
            <Link
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "inline", mb: 2 }}
            >
                https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </Link>

            <Typography variant="body1" gutterBottom>
                <strong>Playlist:</strong>
            </Typography>
            <Link
                href="https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "inline", mb: 3 }}
            >
                https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI
            </Link>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
                ⚠️ Legal Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
                This tool is intended solely for downloading and converting content that you own or have rights to use.
                Downloading copyrighted material from YouTube without the permission of the content owner may violate
                YouTube's Terms of Service and applicable copyright laws.
            </Typography>

            <Typography variant="body1">
                For example, it is acceptable to download:
            </Typography>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
                <li>Your own videos</li>
                <li>Videos that are explicitly licensed under Creative Commons</li>
                <li>Content for which you've obtained express permission</li>
            </ul>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>
                🔐 Privacy Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
                No data is stored on the
                server after conversion. Once the file is processed, all data, including videos and audio files, are
                completely deleted from the server to ensure user privacy.
            </Typography>

            <Typography variant="body1" paragraph>
                By using this app, you acknowledge and accept that no personal data or content is collected, stored, or
                retained by the developer. You are solely responsible for any content you convert and download.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" color="text.secondary">
                By using this app, you agree to take full responsibility for how you use it. The developer is not
                liable for any misuse of the tool.
            </Typography>
        </Container>
    );
}
