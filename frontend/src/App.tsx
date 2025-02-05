import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./components/home";
import CreateRoom from "./components/create-room";
import JoinRoom from "./components/join-room";
import Room from "./components/room";
import RoomRedirect from "./utils/room-redirect";


function App() {
  return (
    <Routes>
      <Route element={<RoomRedirect />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/room/:roomCode" element={<Room/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
