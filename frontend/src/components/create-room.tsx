import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";

const defaultVotes = 2;

const CreateRoom = () => {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  const handlePauseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestCanPause(e.target.value === "false" ? true : false);
  };

  const handleVotesSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotesToSkip(Number(e.target.value));
  };

  const handleCreateRoom = () => {
    axios.post(`${import.meta.env.VITE_API_URL}create-room`, {
      guest_can_pause: guestCanPause,
      votes_to_skip: votesToSkip,
    }, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid
        size={{ xs: 12 }}
        display="flex" justifyContent="center" alignItems="center"
      >
        <Typography component="h4" variant="h4">
          Create A Room
        </Typography>
      </Grid>

      <Grid
        size={{ xs: 12 }}
        display="flex" justifyContent="center" alignItems="center"
      >
        <FormControl component="fieldset">
          <FormHelperText>
            <div className="flex justify-center items-center">
              Guest control of playback state
            </div>
          </FormHelperText>
          <RadioGroup row defaultValue="true" onChange={handlePauseChange}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid
        size={{ xs: 12 }}
        display="flex" justifyContent="center" alignItems="center"
      >
        <FormControl>
          <TextField
            required={true}
            type="number"
            defaultValue={defaultVotes}
            slotProps={{
              htmlInput: {
                min: 1,
                style: { textAlign: "center" }
              }
            }}
            onChange={handleVotesSkipChange}
          />
          <FormHelperText>
            <div className="flex justify-center items-center">
              Votes required to skip song
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid
        size={{ xs: 12 }}
        display="flex" justifyContent="center" alignItems="center"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateRoom}
        >
          Create A Room
        </Button>
      </Grid>

      <Grid
        size={{ xs: 12 }}
        display="flex" justifyContent="center" alignItems="center"
      >
        <Button
          color="secondary"
          variant="contained"
          href="/"
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateRoom;