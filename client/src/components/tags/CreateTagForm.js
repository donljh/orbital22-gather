import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const CreateTagForm = () => {
  const [name, setName] = useState("");
  const [colorHex, setColorHex] = useState("");

  return (
    <form>
      <Stack mb={4} spacing={4}>
        <Typography variant="h6" textAlign="center">
          Creating A New Tag
        </Typography>
        <TextField
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          variant="outlined"
          required
        />
        <input
          type="color"
          value={colorHex}
          onChange={(e) => {
            setColorHex(e.target.value);
          }}
        ></input>
      </Stack>
      <Button
        disableRipple
        variant="contained"
        color="success"
        // onClick={}
        disabled={!NamedNodeMap}
      >
        Create Task
      </Button>
    </form>
  );
};

export default CreateTagForm;
