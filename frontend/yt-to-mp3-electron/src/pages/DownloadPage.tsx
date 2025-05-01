import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel, Typography, Link } from "@mui/material";
import DownloadForm from "../components/DownloadForm";

export default function DownloadPage() {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [isLegalChecked, setIsLegalChecked] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleLegalCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLegalChecked(event.target.checked);
    };

    const handleCloseDialog = () => {
        if (isChecked && isLegalChecked) {
            setDialogOpen(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = dialogOpen ? "hidden" : "auto";
    }, [dialogOpen]);

    return (
        <>
            <Dialog open={dialogOpen} onClose={() => { }} aria-labelledby="legal-disclaimer-dialog">
                <DialogTitle id="legal-disclaimer-dialog">Legal & Privacy Disclaimer</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Please read and accept the following terms and conditions before using the app:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        ⚠️ <strong>Legal Disclaimer:</strong> This tool is intended solely for downloading and converting content that you own or have rights to use. Downloading copyrighted material from YouTube without the permission of the content owner may violate YouTube's Terms of Service and applicable copyright laws.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        🔐 <strong>Privacy Disclaimer:</strong> No data is stored on the server after conversion. Once the file is processed, all data, including videos and audio files, are completely deleted from the server to ensure user privacy.
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                        label={
                            <Typography variant="body2">
                                I have read and accept the{" "}
                                <Link href="/terms" target="_blank" color="inherit">
                                    Terms of Service
                                </Link>
                            </Typography>
                        }
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isLegalChecked} onChange={handleLegalCheckboxChange} />}
                        label="I have read and accept the legal and privacy terms"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        disabled={!isChecked || !isLegalChecked}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Render the DownloadForm when the dialog is closed */}
            {!dialogOpen && <DownloadForm />}
        </>
    );
}
