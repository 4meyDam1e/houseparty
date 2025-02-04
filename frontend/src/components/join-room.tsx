import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, FormControl, TextField } from "@mui/material";
import Spinner from "./spinner";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleJoinRoom = () => {
    setIsLoading(true);
    axios.post(`${import.meta.env.VITE_API_URL}join-room`, {
      code: roomCode,
    }, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data);
      navigate(`/room/${roomCode}`);
    })
    .catch((error) => {
      console.log(error);
      if (error.status === 400 || error.status === 404) {
        setError("Invalid code");
      } else {
        setError("Unexpected server error");
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold mb-2">Join a room</h1>

      <FormControl>
        <TextField
          label="Room Code"
          placeholder="Enter a room code"
          value={roomCode}
          onChange={handleCodeChange}
          error={error ? true : false}
          helperText={error}
        />
      </FormControl>

      <Button
        color="primary"
        variant="contained"
        onClick={handleJoinRoom}
      >
        {isLoading ? (
          <Spinner height="20" width="20" />
        ) : (
          "Join a room"
        )}
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

export default JoinRoom;
