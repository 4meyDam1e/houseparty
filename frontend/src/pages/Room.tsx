import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
// import { Button } from "@mui/material";
import Spinner from "@/components/Spinner";
import RoomSettings from "@/components/RoomSettings";
import Button from "@/components/Button";
import SpotifyLogo from "@/components/SpotifyLogo";


const Room = () => {
  const [guestCanPause, setGuestCanPause] = useState<boolean | null>(null);
  const [votesToSkip, setVotesToSkip] = useState<number | null>(null);
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const authenticateSpotify = () => {
    setIsLoading(true);
    axios.get(
      `${import.meta.env.VITE_API_URL}spotify/refresh-token/`,
      { withCredentials: true }
    )
      .then(({ data }) => {
        console.log(data.message);
        setIsSpotifyAuthenticated(true);
      })
      .catch((error) => {
        if (error?.response?.status < 500) {  // No session/tokens i.e. not authenticated
          axios.get(
            `${import.meta.env.VITE_API_URL}spotify/auth-url/`,
            { withCredentials: true }
          )
            .then(({ data }) => {
              location.replace(data.url);
            })
            .catch((error) => {
              console.error("Error authenticating to Spotify:", error);
            })
            .finally(() => setIsLoading(false));
        } else {  // Unknown error
          console.error("Error authenticating to Spotify:", JSON.stringify(error));
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(
      `${import.meta.env.VITE_API_URL}room-detail/?code=${roomCode}`,
      { withCredentials: true }
    )
      .then(({ data }) => {
        setGuestCanPause(data.guest_can_pause);
        setVotesToSkip(data.votes_to_skip);
        setIsHost(data.is_host);
        if (data.is_host && !isSpotifyAuthenticated) {
          authenticateSpotify();
        }
      })
      .catch(() => navigate("/"))
      .finally(() => setIsLoading(false));
  }, [roomCode, isSpotifyAuthenticated]);

  const handleUpdateRoom = (updatedGuestCanPause: boolean, updatedVoteToSkip: number) => {
    setGuestCanPause(updatedGuestCanPause);
    setVotesToSkip(updatedVoteToSkip);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleLeaveRoom = () => {
    axios.post(
      `${import.meta.env.VITE_API_URL}leave-room/`,
      {},
      { withCredentials: true }
    )
      .then(() => navigate("/"));
  };

  if (isLoading) return <Spinner />;

  if (showSettings) {
    return (
      <RoomSettings
        initialGuestCanPause={guestCanPause}
        initialVotesToSkip={votesToSkip}
        // roomCode={roomCode}
        updateRoom={handleUpdateRoom}
        closeSettings={handleCloseSettings}
      />
    );
  }

  return (
    <div className="flex flex-col justify-start items-center gap-y-5 h-full">
      <SpotifyLogo />

      <h1 className="mb-6 text-4xl font-bold">Room: {roomCode}</h1>

      <div className="flex flex-col justify-center items-center gap-y-2 border border-gray-500 rounded-xl p-5">
        <p><span className="text-secondary-green">Guest can pause:</span> {guestCanPause?.toString()}</p>

        <div className="w-full flex justify-between items-center">
          <p><span className="text-secondary-green">Votes:</span> {votesToSkip}</p>
          <p><span className="text-secondary-green">Host:</span> {isHost?.toString()}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between items-center gap-y-2 w-full">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => setShowSettings(true)}>
          Settings
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleLeaveRoom}>
          Leave room
        </Button>
      </div>

      {/* {isHost &&
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      }

      <Button
        color="secondary"
        variant="contained"
        onClick={() => axios.post(`${import.meta.env.VITE_API_URL}leave-room/`, {}, { withCredentials: true }).then(() => navigate("/"))}
      >
        Leave Room
      </Button> */}
    </div>
  );
};

export default Room;
