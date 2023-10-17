import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

interface AddAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAvailability: (
    selectedDate: string,
    selectedTime: string
  ) => Promise<void>;
}

export function AddAvailabilityModal(props: AddAvailabilityModalProps) {
  const { isOpen, onClose, onAddAvailability } = props;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleApply = () => {
    onAddAvailability(selectedDate, selectedTime);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="add-availability-title"
      aria-describedby="add-availability-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: ["65vw", "40vw", "30vw"],
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          X
        </IconButton>
        <Typography id="add-availability-title" variant="h5" mb={3}>
          Time Slot
        </Typography>

        <TextField
          label="Date"
          type="date"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          fullWidth
          sx={{ marginBottom: 3 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Time"
          type="time"
          value={selectedTime || ""}
          onChange={(e) => setSelectedTime(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Typography mb={2}>Duration: 2 hours</Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </Modal>
  );
}
