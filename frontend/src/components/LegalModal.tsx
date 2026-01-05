import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
} from '@mui/material';
import { X } from 'lucide-react';

interface LegalModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export const LegalModal = ({ open, onClose, title, content }: LegalModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
                <IconButton onClick={onClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 4 }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.8 }}>
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>
                    Okudum, Anladım
                </Button>
            </DialogActions>
        </Dialog>
    );
};
