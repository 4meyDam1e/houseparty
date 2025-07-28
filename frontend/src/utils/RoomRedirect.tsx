import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axios from "axios";
import Spinner from "../pages/Spinner";


/**
 * Checks if the user is in a room and redirects them accordingly.
 */
const RoomRedirect = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}user-room-status/`, { withCredentials: true })
      .then(({ data }) => setRoomCode(data.code))
      .catch((error) => console.error("Error fetching room status:", error))
      .finally(() => setIsLoading(false));
  }, []);

  return isLoading
    ? <Spinner />
    : roomCode
      ? <Navigate to={`/room/${roomCode}`} />
      : <Outlet />;
};

export default RoomRedirect;
