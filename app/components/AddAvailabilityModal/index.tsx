import { useState } from "react";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";

interface AddAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAvailabilityModal(props: AddAvailabilityModalProps) {
  const { isOpen, onClose } = props;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleApply = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
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
          width: "60wh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
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
