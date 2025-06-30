import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Team Name : ${teamName}\nTeam password: ${teamPassword}\nID: ${userId}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Team Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <TextField
            label="Team password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={teamPassword}
            onChange={(e) => setTeamPassword(e.target.value)}
          />
          <TextField
            label="My ID"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
