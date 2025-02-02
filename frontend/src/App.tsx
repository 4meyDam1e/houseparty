import { useEffect } from "react";
import "./App.css";


function App() {

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL)
  }, []);

  return (
    <h1 className="h-full w-full text-center text-5xl">Hello from frontend</h1>
  );
}

export default App;
