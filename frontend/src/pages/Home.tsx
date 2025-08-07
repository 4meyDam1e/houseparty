import { Link } from "react-router";
import Button from "@/components/Button";
import SpotifyLogo from "@/components/SpotifyLogo";


const Home = () => {
  return (
    <div className="flex flex-col justify-start items-center gap-y-5 w-[35vw] h-full">
      <SpotifyLogo />

      <h1 className="mb-6 text-6xl font-extrabold">Houseparty</h1>

      <div className="flex flex-col justify-between items-center gap-y-2.5 w-full">
        <Link to="/create" className="w-full">
          <Button variant="primary" className="w-full">
            Create room
          </Button>
        </Link>

        <Link to="/join" className="w-full">
          <Button variant="secondary" className="w-full">
            Join room
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
