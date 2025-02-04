interface SpinnerProps {
  height?: string;
  width?: string;
}

const Spinner = ({
  height = "40",
  width = "40",
}: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-gray-900"
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
      >

      </div>
    </div>
  );
};

export default Spinner;