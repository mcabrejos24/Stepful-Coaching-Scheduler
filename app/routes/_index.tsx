import type { MetaFunction } from "@remix-run/node";
import theme from "../theme";
import {
  ThemeProvider,
  Button,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);

export const meta: MetaFunction = () => {
  return [
    { title: "Stepful Coaching Scheduler" },
    { name: "description", content: "Coaching Scheduler" },
  ];
};

export default function Index() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Stepful Coaching Scheduler</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: "2rem", margin: "2rem 0" }}>
          <Typography variant="h3" color="primary" gutterBottom>
            Calendar
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Stepful Coaching Scheduler. Use this platform to
            manage your coaching sessions efficiently.
          </Typography>
          <Button variant="contained" color="primary">
            Schedule a Session
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: "1rem" }}
          >
            Learn More
          </Button>
        </Paper>
        <Calendar
          localizer={localizer}
          events={[
            {
              title: "My Event",
              start: new Date(),
              end: new Date().setHours(new Date().getHours() + 2),
            },
            {
              title: "My Event",
              start: new Date(new Date().getTime() + 15 * 60 * 1000),
              end: new Date(
                new Date().getTime() + 15 * 60 * 1000 + 2 * 60 * 60 * 1000
              ),
            },
          ]}
          startAccessor="start"
          endAccessor="end"
        />
      </Container>
    </ThemeProvider>
  );
}
