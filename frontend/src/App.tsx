import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./components/home";
import CreateRoom from "./components/create-room";
import RoomJoin from "./components/room-join";


function App() {

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL)
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<RoomJoin />} />
    </Routes>
  );
}

export default App;
