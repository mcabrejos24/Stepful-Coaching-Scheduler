import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import { type Event } from "react-big-calendar";

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: string;
  event: Event;
  updateTimeSlot: (
    id: number,
    notes?: string,
    satisfaction?: string,
    studentBooking?: boolean
  ) => void;
}

export function TimeSlotModal(props: TimeSlotModalProps) {
  const { isOpen, onClose, userType, event, updateTimeSlot } = props;
  const isPast = event && event.end && event.end < new Date();
  const [satisfaction, setSatisfaction] = useState<string>("1");
  const [notes, setNotes] = useState("");
  function handleBooking() {
    updateTimeSlot(event.resource.id, undefined, undefined, true);
    onClose();
  }

  // const handleEdit = () => {
  //   // Handle the edit logic here
  // };

  const handleSaveFeedback = () => {
    updateTimeSlot(event.resource.id, notes, satisfaction, false);
    onClose();
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
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
            right: 16,
            top: 8,
          }}
        >
          X
        </IconButton>
        <Typography id="time-slot-title" variant="h5" mb={2}>
          {event?.title}
        </Typography>

        <Typography variant="body1" mb={2}>
          Date: {event?.start?.toLocaleDateString()}
        </Typography>
        <Typography variant="body1" mb={2}>
          Start time: {event?.start?.toLocaleTimeString()}
        </Typography>
        <Typography variant="body1" mb={2}>
          End time: {event?.end?.toLocaleTimeString()}
        </Typography>

        {userType === "student" && !isPast && (
          <>
            {event.resource?.status !== "available" ? (
              // TODO: allow students to cancel a slot
              // <Button
              //   variant="contained"
              //   color="secondary"
              //   onClick={handleBooking}
              // >
              //   Cancel
              // </Button>
              <></>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
              >
                Book
              </Button>
            )}
          </>
        )}

        {userType === "coach" && (
          <>
            {!isPast ? (
              <>
                {/* <Button TODO: add edit and delete functionality
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button variant="contained" color="secondary">
                  Delete
                </Button> */}
              </>
            ) : (
              <>
                {event.resource?.status !== "available" && (
                  <Typography variant="h6" mb={1}>
                    Feedback
                  </Typography>
                )}
                {(isPast && event.resource?.status === "booked") ||
                event?.resource?.status === "incomplete" ? (
                  <>
                    <Typography color="warning.main" variant="body2" mb={3}>
                      Add feedback to complete this time slot.
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel>Student Satisfaction (1-5)</InputLabel>
                        <Select
                          value={satisfaction}
                          onChange={(e) => {
                            setSatisfaction(e.target.value);
                          }}
                          label="Student Satisfaction (1-5)"
                        >
                          {["1", "2", "3", "4", "5"].map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Notes"
                        variant="outlined"
                        multiline
                        rows={2}
                        fullWidth
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveFeedback}
                      >
                        Save
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    {event.resource?.status === "complete" && (
                      <>
                        <Typography variant="body1" mb={2}>
                          Student satisfaction: {event?.resource?.satisfaction}
                        </Typography>
                        <Typography variant="body1" mb={2}>
                          Notes: {event?.resource?.notes}
                        </Typography>
                        {/* <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSaveFeedback}
                    >
                      Edit
                    </Button> */}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}
