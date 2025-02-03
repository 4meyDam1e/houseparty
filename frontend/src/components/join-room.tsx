import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, FormControl, TextField } from "@mui/material";

const JoinRoom = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleJoinRoom = () => {
    axios.post(`${import.meta.env.VITE_API_URL}join-room`, {
      code: code,
    }, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data);
      navigate(`/room/${code}`);
    })
    .catch((error) => {
      console.log(error);
      if (error.status === 400 || error.status === 404) {
        setError("Invalid code");
      } else {
        setError("Unexpected server error");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold mb-2">Join A Room</h1>

      <FormControl>
        <TextField
          label="Room Code"
          placeholder="Enter a room code"
          value={code}
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
        Join A Room
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
