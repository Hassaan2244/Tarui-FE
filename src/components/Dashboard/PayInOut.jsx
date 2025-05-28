import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function PayInOut({
  lowestLedgers = [],
  highestLedgers = [],
  totalPayIn,
  totalPayOut,
}) {
  const mergedMap = new Map();

  [...highestLedgers, ...lowestLedgers].forEach((ledger) => {
    mergedMap.set(ledger.id, ledger);
  });

  const allLedgers = Array.from(mergedMap.values());
  const payInLedgers = allLedgers.filter(
    (ledger) => parseFloat(ledger.latestBalance) > 0
  );
  const payOutLedgers = allLedgers
    .filter((ledger) => parseFloat(ledger.latestBalance) <= 0)
    .reverse();

  return (
    <div className="flex flex-wrap gap-6 mt-8 w-full">
      {/* Pay In Section */}
      <div className="w-full lg:w-[49%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          Top Recievables
          <h2 className="text-xl font-semibold text-cyan-400"></h2>
          <div className="bg-green-400/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="space-y-4">
          {payInLedgers.map((ledger) => (
            <div
              key={ledger.id}
              className="flex justify-between items-center bg-white/5 p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-400/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-white font-medium">{ledger.name}</p>
              </div>
              <p className="text-green-400 font-semibold">
                +RS {parseFloat(ledger.latestBalance).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-green-400/10 border border-green-400/20 p-4 rounded-xl">
          <p className="text-sm text-gray-300">Total Recievables</p>
          <p className="text-xl font-bold text-green-400">
            +RS {totalPayIn.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pay Out Section */}
      <div className="w-full lg:w-[49%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-cyan-400">Top Payables</h2>
          <div className="bg-red-400/10 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
        </div>

        <div className="space-y-4">
          {payOutLedgers.map((ledger) => (
            <div
              key={ledger.id}
              className="flex justify-between items-center bg-white/5 p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-400/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-white font-medium">{ledger.name}</p>
              </div>
              <p className="text-red-400 font-semibold">
                -RS{" "}
                {Math.abs(parseFloat(ledger.latestBalance)).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-red-400/10 border border-red-400/20 p-4 rounded-xl">
          <p className="text-sm text-gray-300">Total Payables</p>
          <p className="text-xl font-bold text-red-400">
            RS {totalPayOut.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
