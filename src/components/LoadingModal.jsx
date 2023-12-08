export default function LoadingModal({ showing }) {
  return (
    <div
      className={`${
        showing ? "flex" : "hidden"
      } fixed top-0 left-0 z-[999] w-full h-full items-center justify-center bg-gray-300/50`}
    >
      <span className="loading loading-spinner text-primary"></span>
    </div>
  );
}
