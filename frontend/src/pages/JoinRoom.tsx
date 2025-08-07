import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";
import SpotifyLogo from "@/components/SpotifyLogo";


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

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col justify-start items-center gap-y-5 h-full">
      <SpotifyLogo />

      <h1 className="mb-6 text-4xl font-bold">Join a room</h1>

      <Input
        placeholderText="Enter a room code"
        value={roomCode}
        onChange={setRoomCode}
        error={!!error}
        helperText={error}
      />

      <div className="flex flex-col justify-between items-center gap-y-2 w-full">
        <Button variant="primary" className="w-full" onClick={handleJoinRoom}>
          Join room
        </Button>

        <Link to="/" className="w-full">
          <Button variant="secondary" className="w-full">
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JoinRoom;
