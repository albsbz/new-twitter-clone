import { ArrowPathIcon } from "@heroicons/react/24/outline";

function Spinner() {
  return (
    <div className="flex justify-center items-center ">
      Loading...
      <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />
    </div>
  );
}

export default Spinner;
