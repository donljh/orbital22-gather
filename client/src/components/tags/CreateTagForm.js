import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import useAxiosRes from "../../hooks/useAxiosRes";

const CreateTagForm = (props) => {
  const [name, setName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const axiosRes = useAxiosRes();
  const createNewTag = async () => {
    console.log(colorHex);
    axiosRes
      .post("/tags", { name, colorHex })
      .then((res) => {
        setName("");
        setColorHex("#000000");
        props.setIsTagListModified(true);
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

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
        onClick={createNewTag}
        disabled={!name}
      >
        Create Tag
      </Button>
    </form>
  );
};

export default CreateTagForm;
