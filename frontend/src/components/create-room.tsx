import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Button,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const defaultVotes = 2;

const CreateRoom = () => {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const navigate = useNavigate();

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
      const { code } = response.data;
      navigate(`/room/${code}`);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold">Create A Room</h1>

      <FormControl component="fieldset">
        <FormHelperText>
          <div className="text-center">
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

      <FormControl>
        <TextField
          required
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
          <div className="text-center">
            Votes required to skip song
          </div>
        </FormHelperText>
      </FormControl>

      <Button
        color="primary"
        variant="contained"
        onClick={handleCreateRoom}
      >
        Create A Room
      </Button>

      <Button
        color="secondary"
        variant="contained"
        href="/"
      >
        Back
      </Button>
    </div>
  );
};

export default CreateRoom;