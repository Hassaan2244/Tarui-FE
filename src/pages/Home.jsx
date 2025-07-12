import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(0);
  const [cpuHistory, setCpuHistory] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const getCpu = async () => {
      try {
        const usage = await invoke("get_cpu_usage");
        const usageFixed = parseFloat(usage.toFixed(2));
        setCpuUsage(usageFixed);

        // Add new point, keep last 20
        setCpuHistory((prev) => [
          ...prev.slice(-19),
          { time: new Date().toLocaleTimeString(), usage: usageFixed },
        ]);
      } catch (err) {
        console.error("Failed to fetch CPU usage:", err);
      }
    };

    const cpuInterval = setInterval(getCpu, 3000);
    getCpu();

    return () => {
      clearInterval(timeInterval);
      clearInterval(cpuInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col justify-center items-center relative p-6">
      <div className="absolute top-6 right-6 text-right">
        <p className="text-xl font-mono">{time.toLocaleTimeString()}</p>
        <p className="text-sm font-light">{time.toLocaleDateString()}</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-10 w-full max-w-2xl shadow-xl space-y-6 mt-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
            Welcome!
          </h2>
        </div>

        <div className="space-y-4 text-center">
          <div className="text-lg">
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CPU Usage:
            </span>{" "}
            {cpuUsage}%
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="time" tick={{ fill: "white", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "white", fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#00FFFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          {token ? (
            <Link to={"/dashboard"}>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to={"/login"}>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 mr-4">
                  Login
                </button>
              </Link>
              {/* <Link to={"/signup"}>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                  Signup
                </button>
              </Link> */}
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 text-xs text-gray-500">
        Powered by Tauri + React + Tailwind
      </div>
    </div>
  );
}
