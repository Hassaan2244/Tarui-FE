import { CircleArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className=" relatve min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col justify-center items-center relative p-6">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-opacity opacity-80 hover:opacity-100"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2" />
        <span>Go to home</span>
      </Link>
      <h1 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-lg">
        Dashboard
      </h1>
    </div>
  );
}
