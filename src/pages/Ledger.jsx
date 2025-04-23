import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle, Search } from "lucide-react";

export default function Ledger() {
  const ledgers = [
    {
      id: 1,
      name: "Main Operations Ledger",
      entries: 142,
      updated: "2 hours ago",
    },
    {
      id: 2,
      name: "Quantum Research Budget",
      entries: 87,
      updated: "1 day ago",
    },
    { id: 3, name: "Core Infrastructure", entries: 256, updated: "3 days ago" },
    {
      id: 4,
      name: "Security Expenditures",
      entries: 53,
      updated: "1 week ago",
    },
    { id: 5, name: "Personnel Accounts", entries: 198, updated: "2 weeks ago" },
    {
      id: 6,
      name: "Experimental Projects",
      entries: 31,
      updated: "3 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2">
              Ledgers
            </h1>
            <p className="text-gray-400 mt-1">Manage all financial records</p>
          </div>
          <Link
            to="add"
            className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Create New Ledger</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-1 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ledgers..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
        </div>

        {/* Ledger List */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 p-4 text-gray-400 text-sm font-medium">
            <div className="col-span-8 md:col-span-6">Ledger Name</div>
            <div className="col-span-4 md:col-span-2 text-center">Entries</div>
            <div className="hidden md:block md:col-span-3">Last Updated</div>
            <div className="hidden md:block md:col-span-1"></div>
          </div>

          {ledgers.map((ledger) => (
            <div
              key={ledger.id}
              className="grid grid-cols-12 items-center border-b border-white/5 hover:bg-white/5 transition-colors p-4"
            >
              <div className="col-span-8 md:col-span-6">
                <h3 className="font-medium text-white">{ledger.name}</h3>
                <p className="text-xs text-gray-400 md:hidden">
                  {ledger.entries} entries • {ledger.updated}
                </p>
              </div>
              <div className="col-span-4 md:col-span-2 text-center text-cyan-400">
                {ledger.entries}
              </div>
              <div className="hidden md:block md:col-span-3 text-sm text-gray-400">
                {ledger.updated}
              </div>
              <div className="hidden md:block md:col-span-1 text-right">
                <Link
                  to={`/ledger/${ledger.id}`}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-end"
                >
                  <span className="sr-only">View</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 text-sm">
          <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all">
            Previous
          </button>
          <div className="text-gray-400">
            Showing <span className="text-white">1-{ledgers.length}</span> of{" "}
            <span className="text-white">{ledgers.length}</span> ledgers
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
