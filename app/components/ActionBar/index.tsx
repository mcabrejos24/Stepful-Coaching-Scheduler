import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link } from "@remix-run/react";

interface ActionBarProps {
  isCoach: boolean;
  onAddAvailability?: () => void;
}

export function ActionBar(props: ActionBarProps) {
  const { isCoach, onAddAvailability } = props;
  return (
    <AppBar position="relative" color="default" elevation={1}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="inherit" component={Link} to="/">
          Home
        </Button>
        <Typography variant="h6">
          {isCoach ? "Coach" : "Student"} Dashboard
        </Typography>
        {isCoach && (
          <Button
            color="primary"
            variant="contained"
            onClick={onAddAvailability}
          >
            Add Availability
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
