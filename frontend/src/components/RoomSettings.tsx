import { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Collapse
} from "@mui/material";
import Spinner from "../pages/Spinner";


interface RoomSettingsProps {
  initialGuestCanPause: boolean | null;
  initialVotesToSkip: number | null;
  updateRoom: (guestCanPause: boolean, votesToSkip: number) => void;
  closeSettings: () => void;
}

const RoomSettings = ({
  initialGuestCanPause,
  initialVotesToSkip,
  updateRoom,
  closeSettings,
}: RoomSettingsProps) => {
  const [guestCanPause, setGuestCanPause] = useState<boolean | null>(initialGuestCanPause);
  const [votesToSkip, setVotesToSkip] = useState<number | null>(initialVotesToSkip);
  const [isLoading, setIsLoading] = useState(false);
  const [mssg, setMssg] = useState<string>("")
  const [isError, setIsError] = useState<boolean>(false)

  const handleUpdateRoom = () => {
    setIsLoading(true);
    axios.patch(
      `${import.meta.env.VITE_API_URL}update-room/`,
      {
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip
      },
      { withCredentials: true }
    )
      .then(({ data }) => {
        const { guest_can_pause, votes_to_skip } = data;
        updateRoom(guest_can_pause, votes_to_skip);
        setMssg("Room updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating room:", error);
        setIsError(true);
        setMssg("Error updating room...");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <Collapse in={mssg !== ""}>
        <Alert
          severity={isError ? "error" : "success"}
          onClose={() => {
            setMssg("");
            setIsError(false);
          }}
        >
          {mssg}
        </Alert>
      </Collapse>

      <h1 className="text-4xl font-bold">Room Settings</h1>

      <FormControl component="fieldset">
        <FormHelperText>
          <div className="text-center">Guest control of playback state</div>
        </FormHelperText>
        <RadioGroup
          row
          defaultValue={initialGuestCanPause}
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
          defaultValue={initialVotesToSkip}
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

      <Button color="primary" variant="contained" onClick={handleUpdateRoom}>
        {isLoading ? <Spinner height="20" width="20" /> : "Update Room"}
      </Button>

      <Button color="secondary" variant="contained" onClick={closeSettings}>Close</Button>
    </div>
  );
};

export default RoomSettings;
