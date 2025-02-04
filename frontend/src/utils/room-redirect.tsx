import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axios from "axios";
import Spinner from "../components/spinner";

const RoomRedirect = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}user-in-room`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data);
      const { code } = response.data;
      setRoomCode(code);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Spinner />
  }

  return (
    roomCode ? (
      <Navigate to={`/room/${roomCode}`} />
    ) : (
      <Outlet />
    )
  );
};

export default RoomRedirect;