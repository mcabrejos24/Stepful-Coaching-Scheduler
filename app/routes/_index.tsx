import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

export const meta: MetaFunction = () => {
  return [
    { title: "Stepful Coaching Scheduler" },
    { name: "description", content: "Coaching Scheduler" },
  ];
};

export default function Index() {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2" gutterBottom mb={10}>
        Welcome to Stepful's Coaching Scheduler
      </Typography>
      <Box mt={2}>
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item xs={14} md="auto">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/coach/1"
              fullWidth
              sx={{ py: 2 }}
            >
              I'm a Coach
            </Button>
          </Grid>
          <Grid item xs={14} md="auto">
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/student/1"
              fullWidth
              sx={{ py: 2 }}
            >
              I'm a Student
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
