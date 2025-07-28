import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Spinner from "./Spinner";


const defaultVotes = 2;

const CreateRoom = () => {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    setIsLoading(true);
    axios.post(
      `${import.meta.env.VITE_API_URL}create-room/`,
      {
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip
      },
      { withCredentials: true }
    )
      .then(({ data }) => navigate(`/room/${data.code}`))
      .catch((error) => console.error("Error creating room:", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold">Create a Room</h1>

      <FormControl component="fieldset">
        <FormHelperText>
          <div className="text-center">Guest control of playback state</div>
        </FormHelperText>
        <RadioGroup
          row
          defaultValue="true"
          onChange={(e) => setGuestCanPause(e.target.value === "true")}
        >
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
          onChange={(e) => setVotesToSkip(Number(e.target.value))}
        />
        <FormHelperText>
          <div className="text-center">Votes required to skip song</div>
        </FormHelperText>
      </FormControl>

      <Button color="primary" variant="contained" onClick={handleCreateRoom}>
        {isLoading ? <Spinner height="20" width="20" /> : "Create a Room"}
      </Button>

      <Button color="secondary" variant="contained" href="/">Back</Button>
    </div>
  );
};

export default CreateRoom;
