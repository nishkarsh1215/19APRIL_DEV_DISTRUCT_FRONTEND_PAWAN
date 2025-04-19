import { FaAngular, FaJava, FaReact, FaVuejs } from "react-icons/fa";

const Framework = () => {
  return (
    <div className="mt-10">
      <p className="text-gray-500">
        or start a blank app with your favorite stack
      </p>
      <div className="flex items-center justify-between mt-5">
        <FaReact className="text-gray-500 text-5xl" />
        <FaAngular className="text-gray-500 text-5xl" />
        <FaJava className="text-gray-500 text-5xl" />
        <FaVuejs className="text-gray-500 text-5xl" />
      </div>
    </div>
  );
};

export default Framework;
