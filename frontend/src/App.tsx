import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./components/home";
import CreateRoom from "./components/create-room";
import JoinRoom from "./components/join-room";
import Room from "./components/room";


function App() {

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL)
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/room/:roomCode" element={<Room/>} />
    </Routes>
  );
}

export default App;
