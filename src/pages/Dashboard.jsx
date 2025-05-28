import { CircleArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardStats from "../components/Dashboard/DashboardStats";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import LowQuantityProducts from "../components/Dashboard/LowQuantityProducts";
import PayInOut from "../components/Dashboard/PayInOut";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "../redux/slices/statsSlice";
import Loader from "../components/Loader";

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    recentTransactions,
    highestLedgers,
    lowestLedgers,
    totalPositiveBalance,
    totalNegativeBalance,
    loading,
  } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getStats());
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {loading && <Loader />}
      <h1 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-lg mb-6">
        Dashboard
      </h1>

      {/* Top Stats Section */}
      {/* <DashboardStats /> */}

      {/* Main Grid Section: Transactions & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-stretch">
        {/* Left: Transactions (2 cols) */}
        <div className="lg:col-span-2 h-full">
          <RecentTransactions transactions={recentTransactions} />
        </div>

        {/* Right: Low Inventory */}
        <div className="lg:col-span-1 h-full">
          <LowQuantityProducts />
        </div>
      </div>

      {/* Pay In / Pay Out Section (side-by-side and matching height) */}
      <div className="mt-8">
        <PayInOut
          highestLedgers={highestLedgers}
          lowestLedgers={lowestLedgers}
          totalPayIn={totalPositiveBalance}
          totalPayOut={totalNegativeBalance}
        />
      </div>
    </div>
  );
}
