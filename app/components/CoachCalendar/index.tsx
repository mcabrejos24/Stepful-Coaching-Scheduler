import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, type Event, momentLocalizer } from "react-big-calendar";
import { Container, useTheme } from "@mui/material";

const localizer = momentLocalizer(moment);

interface CoachCalendarProps {
  events?: Event[];
  handleSlotClick: (event: Event) => void;
}

export function CoachCalendar(props: CoachCalendarProps) {
  const theme = useTheme();
  const { events, handleSlotClick } = props;

  const customEventPropGetter = (
    event: Event,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    let backgroundColor = theme.palette.info.main; // default color
    if (event.resource?.hasConflict) {
      backgroundColor = theme.palette.error.main;
    } else {
      switch (event.resource.status) {
        case "booked":
          backgroundColor = theme.palette.secondary.main;
          break;
        case "incomplete":
          backgroundColor = theme.palette.warning.main;
          break;
        case "complete":
          backgroundColor = theme.palette.success.main;
          break;
        default:
          backgroundColor = theme.palette.info.main;
          break;
      }
    }

    return { style: { backgroundColor } };
  };

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "2rem", height: "75vh", overflowY: "auto" }}
    >
      <Calendar
        localizer={localizer}
        defaultView="week"
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={customEventPropGetter}
        onSelectEvent={handleSlotClick}
      />
    </Container>
  );
}
