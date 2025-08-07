import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "@/pages/Home";
import CreateRoom from "@/pages/CreateRoom";
import JoinRoom from "@/pages/JoinRoom";
import Room from "@/pages/Room";
import RoomRedirect from "@/utils/RoomRedirect";
import Disclaimer from "@/components/Disclaimer";


function App() {
  return (
    <main className="flex flex-col justify-start items-center">
      <Routes>
        <Route element={<RoomRedirect />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomCode" element={<Room/>} />
        {/* use replace prop to replaced unmatched props with "/" in browser history stack */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Disclaimer />
    </main>
  );
}

export default App;
