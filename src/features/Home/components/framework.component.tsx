import { FaAngular, FaJava, FaReact, FaVuejs } from "react-icons/fa";

const Framework = () => {
  return (
    <div className="mt-10">
      <p className="text-gray-500">
        or start a blank app with your favorite stack
      </p>
      <div className="flex items-center justify-between mt-5">
        <FaReact className="text-gray-500 text-5xl transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(99,102,241,0.9)]" />
        <FaAngular className="text-gray-500 text-5xl transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(220,38,38,0.9)]" />
        <FaJava className="text-gray-500 text-5xl transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(234,179,8,0.9)]" />
        <FaVuejs className="text-gray-500 text-5xl transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(34,197,94,0.9)]" />
      </div>
    </div>
  );
};

export default Framework;
