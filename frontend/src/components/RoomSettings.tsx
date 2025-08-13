import { useState } from "react";
import axios from "axios";
import { Radio, RadioChangeEvent } from "antd";
import Spinner from "@/components/Spinner";
import SpotifyLogo from "@/components/SpotifyLogo";
import InputNumber from "@/components/InputNumber";
import Button from "./Button";


const defaultVotesToSkip = 2;

interface RoomSettingsProps {
  initialGuestCanPause: boolean | null;
  initialVotesToSkip: number | null;
  updateRoom: (guestCanPause: boolean, votesToSkip: number) => void;
  closeSettings: () => void;
}

const RoomSettings = ({
  initialGuestCanPause,
  initialVotesToSkip,
  updateRoom,
  closeSettings,
}: RoomSettingsProps) => {
  const [guestCanPause, setGuestCanPause] = useState(initialGuestCanPause !== null ? initialGuestCanPause : true);
  const [votesToSkip, setVotesToSkip] = useState(initialVotesToSkip || defaultVotesToSkip);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRoom = () => {
    setIsLoading(true);
    axios.patch(
      `${import.meta.env.VITE_API_URL}update-room/`,
      {
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip
      },
      { withCredentials: true }
    )
      .then(({ data }) => {
        const { guest_can_pause, votes_to_skip } = data;
        updateRoom(guest_can_pause, votes_to_skip);
      })
      .catch((error) => {
        console.error("Error updating room:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col justify-start items-center gap-y-5 h-full">
      <SpotifyLogo />

      <h1 className="mb-6 text-4xl font-bold">Room settings</h1>

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
        defaultValue={`${initialVotesToSkip || defaultVotesToSkip}`}
        onChange={setVotesToSkip}
      />

      <Button variant="primary" onClick={handleUpdateRoom}>
        {isLoading ? <Spinner height="20" width="20" /> : "Update room"}
      </Button>

      <Button variant="secondary" onClick={closeSettings}>Close</Button>
    </div>
  );
};

export default RoomSettings;
