import { Box, MenuItem, Select } from "@mui/material";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export function RoleSwitchFooter() {
  const [role, setRole] = useState<string>("coach");
  const navigate = useNavigate();

  const handleRoleChange = (value: string) => {
    setRole(value);
    navigate(`/${value}`);
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      width="100%"
      p={2}
      display="flex"
      justifyContent="flex-start"
      borderTop="1px solid #ddd"
      bgcolor="background.paper"
    >
      <Select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        variant="outlined"
      >
        <MenuItem value="coach">Coach</MenuItem>
        <MenuItem value="student">Student</MenuItem>
      </Select>
    </Box>
  );
}
