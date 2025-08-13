import { Link } from "react-router";
import Button from "@/components/Button";
import SpotifyLogo from "@/components/SpotifyLogo";


const Home = () => {
  return (
    <div className="flex flex-col justify-start items-center gap-y-5 w-[35vw] h-full">
      <SpotifyLogo />

      <h1 className="mb-6 text-6xl font-extrabold">Houseparty</h1>

      <div className="flex flex-col justify-between items-center gap-y-2.5 w-full">
        <Link to="/create">
          <Button variant="primary">
            Create room
          </Button>
        </Link>

        <Link to="/join">
          <Button variant="secondary">
            Join room
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
