import { Container, Typography, Divider, Box } from "@mui/material";

export default function TermsAndConditionsPage() {
    return (
        <Box sx={{ bgcolor: "#121212", color: "white" }}>
            <Container sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Terms and Conditions
                </Typography>

                <Typography variant="body1" paragraph>
                    Last updated: May 1, 2025
                </Typography>

                <Typography variant="h5" gutterBottom>
                    1. Introduction
                </Typography>
                <Typography variant="body1" paragraph>
                    These terms and conditions ("Terms") govern your use of the YouTube MP3 Converter ("Service"). By using this Service, you agree to these Terms. If you do not agree with any part of these Terms, you must not use the Service.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    2. User Rights and Responsibilities
                </Typography>
                <Typography variant="body1" paragraph>
                    You are granted a non-exclusive, non-transferable, limited license to access and use the Service for lawful purposes. You must not use the Service for any illegal activities or purposes that violate the rights of others.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    3. Restrictions
                </Typography>
                <Typography variant="body1" paragraph>
                    You agree not to:
                </Typography>
                <ul>
                    <li>Use the Service for downloading copyrighted material without the permission of the content owner.</li>
                    <li>Distribute, sell, or sublicense the Service or its components.</li>
                    <li>Engage in any activity that disrupts or interferes with the functioning of the Service.</li>
                </ul>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    4. Privacy and Data Collection
                </Typography>
                <Typography variant="body1" paragraph>
                    We respect your privacy. This Service does not collect any personal information unless you voluntarily provide it. Any data collected during the use of the Service is processed in accordance with our Privacy Policy.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    5. Limitation of Liability
                </Typography>
                <Typography variant="body1" paragraph>
                    To the fullest extent permitted by law, we are not liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the Service, including but not limited to loss of data, loss of profits, or any other damage.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    6. Termination
                </Typography>
                <Typography variant="body1" paragraph>
                    We reserve the right to terminate or suspend your access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    7. Governing Law
                </Typography>
                <Typography variant="body1" paragraph>
                    These Terms are governed by and construed in accordance with the laws of the jurisdiction in which the Service operates. Any disputes relating to these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    8. Modifications to Terms
                </Typography>
                <Typography variant="body1" paragraph>
                    We reserve the right to update or change these Terms at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    9. Contact Information
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions regarding these Terms, please contact us at: support@youtube-mp3-converter.com
                </Typography>

                <Typography variant="body1" paragraph>
                    <strong>End of Terms and Conditions</strong>
                </Typography>
            </Container>
        </Box>
    );
}
