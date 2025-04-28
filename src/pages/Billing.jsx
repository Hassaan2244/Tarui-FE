import { EditIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Billing() {
  return (
    <div>
      {" "}
      <Link
        to={`/billing/add`}
        className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
      >
        <EditIcon className="w-5 h-5 mr-2" />
        <span>Create Transaction</span>
      </Link>
    </div>
  );
}
