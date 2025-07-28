import { Button, ButtonGroup } from "@mui/material";


const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-5">Houseparty</h1>

      <ButtonGroup
        color="primary"
        variant="contained"
      >
        <Button
          color="primary"
          variant="contained"
          href="/create"
        >
          Create A Room
        </Button>

        <Button
          color="secondary"
          variant="contained"
          href="/join"
        >
          Join A Room
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Home;
