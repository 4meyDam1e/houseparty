import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Button } from "@mui/material";
import Spinner from "./spinner";

const Room = () => {
  const [guestCanPause, setGuestCanPause] = useState<boolean | null>(null);
  const [votesToSkip, setVotesToSkip] = useState<number | null>(null);
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { roomCode } = useParams();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}room-detail/?code=${roomCode}`, { withCredentials: true })
      .then(({ data }) => {
        setGuestCanPause(data.guest_can_pause);
        setVotesToSkip(data.votes_to_skip);
        setIsHost(data.is_host);
      })
      .catch(() => navigate("/"))
      .finally(() => setIsLoading(false));
  }, [roomCode]);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col justify-center items-center gap-y-2">
      <h1 className="text-4xl font-bold">Code: {roomCode}</h1>
      <p>Guest can pause: {guestCanPause?.toString()}</p>
      <p>Votes: {votesToSkip}</p>
      <p>Host: {isHost?.toString()}</p>

      <Button
        color="secondary"
        variant="contained"
        onClick={() => axios.post(`${import.meta.env.VITE_API_URL}leave-room/`, {}, { withCredentials: true }).then(() => navigate("/"))}
      >
        Leave Room
      </Button>
    </div>
  );
};

export default Room;
