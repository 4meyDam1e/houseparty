import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import RoomRedirect from "./utils/RoomRedirect";


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
