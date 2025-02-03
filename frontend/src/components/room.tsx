import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const defaultVotes = 2;

const Room = () => {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [isHost, setIsHost] = useState(true);
  const params = useParams();
  const roomCode = params.roomCode;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}get-room?code=${roomCode}`)
    .then((response) => {
      console.log(response.data);
      const {
        guest_can_pause,
        votes_to_skip,
        is_host,
      } = response.data;
      setGuestCanPause(guest_can_pause);
      setVotesToSkip(votes_to_skip);
      setIsHost(is_host);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [roomCode]);


  return (
    <div>
      <h3>{roomCode}</h3>
      <p>Guest can pause: {guestCanPause.toString()}</p>
      <p>Votes: {votesToSkip}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
};

export default Room;