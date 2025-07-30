const Disclaimer = () => {
  return (
    <div className="flex flex-col justify-between items-center gap-y-7 mt-20 w-80">
      <div className="w-full border-t border-gray-700"></div>
      <p className="w-4/5 text-muted-text text-xs text-center">
        This is a personal, <span className="font-bold underline">non-commercial</span> project made for educational and recreational purposes. It is not affiliated with, endorsed by, or sponsored by Spotify. All trademarks and logos are the property of their respective owners.
      </p>
    </div>
  );
};

export default Disclaimer;
