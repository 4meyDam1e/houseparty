import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import Navbar from "@/components/Navbar";
import { Radio, RadioChangeEvent } from "antd";
import Spinner from "@/components/Spinner";
import InputNumber from "@/components/InputNumber";
import Button from "@/components/Button";


const defaultVotesToSkip = 2;

const CreateRoom = () => {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotesToSkip);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    setIsLoading(true);
    axios.post(
      `${import.meta.env.VITE_API_URL}create-room/`,
      {
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip
      },
      { withCredentials: true }
    )
      .then(({ data }) => navigate(`/room/${data.code}`))
      .catch((error) => console.error("Error creating room:", error))
      .finally(() => setIsLoading(false));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col justify-start items-center gap-y-5 h-full">
      <Navbar />

      <h1 className="mb-6 text-4xl font-bold">Create a room</h1>

      <Radio.Group
        value={guestCanPause}
        onChange={(e: RadioChangeEvent) => setGuestCanPause(e.target.value)}
        buttonStyle="solid"
        options={[
          {
            value: true,
            label: (
              <p className="text-sm text-primary-text">Play/Pause</p>
            ),
          },
          {
            value: false,
            label: (
              <p className="text-sm text-primary-text">No Control</p>
            ),
          }
        ]}
      />

      <InputNumber
        value={`${votesToSkip}`}
        defaultValue={`${defaultVotesToSkip}`}
        onChange={setVotesToSkip}
      />

      <div className="flex flex-col justify-between items-center gap-y-2">
        <Button variant="primary" onClick={handleCreateRoom}>
          Create room
        </Button>

        <Link to="/">
          <Button variant="secondary">
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CreateRoom;
