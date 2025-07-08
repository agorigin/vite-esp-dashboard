export default function ButtonGroup({ onStart, onHold, onCalibrate, isFetching }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      <button
        onClick={onStart}
        type="button"
        className="text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Start
      </button>
      <button
        onClick={onHold}
        type="button"
        className="text-white bg-gradient-to-r from-red-400 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Hold
      </button>
      <button
        onClick={onCalibrate}
        type="button"
        className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Calibrate
      </button>
    </div>
  );
}
