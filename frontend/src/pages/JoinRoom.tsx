import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, FormControl, TextField } from "@mui/material";
import Spinner from "./Spinner";


const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomCode) {
      setError("Invalid code");
      return
    }

    setIsLoading(true);
    axios.post(
      `${import.meta.env.VITE_API_URL}join-room/`,
      { code: roomCode },
      { withCredentials: true }
    )
      .then(() => navigate(`/room/${roomCode}`))
      .catch((error) => {
        console.error("Error joining room:", error);
        setError(error.response?.status === 404 ? "Invalid code" : "Unexpected server error");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold mb-2">Join a Room</h1>

      <FormControl>
        <TextField
          label="Room Code"
          placeholder="Enter a room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </FormControl>

      <Button color="primary" variant="contained" onClick={handleJoinRoom}>
        {isLoading ? <Spinner height="20" width="20" /> : "Join a Room"}
      </Button>
      <Button color="secondary" variant="contained" href="/">Back</Button>
    </div>
  );
};

export default JoinRoom;
