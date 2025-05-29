import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";
import { formatDate } from "../../config/helperFunctions";
import { Link } from "react-router-dom";

export default function RecentTransactions({ transactions }) {
  const upwardTypes = new Set([
    "Sell",
    "Return-Out",
    "Credit Amount",
    "Open Sell",
  ]);

  console.log(transactions);
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">
          Recent Transactions
        </h2>
        <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition" />
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => {
          const isUpward = upwardTypes.has(transaction.type);
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    isUpward
                      ? "bg-green-400/10 text-green-400"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {isUpward ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <Link
                    to={`/billing/${transaction.id}`}
                    state={{ transaction, from: location.pathname }}
                  >
                    <p className="text-white font-medium">
                      {transaction.type || "N/A"}
                    </p>
                  </Link>
                  <p className="text-gray-300 text-xs font-light">
                    {transaction.description || "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="text-right min-w-[110px]">
                <p
                  className={`font-semibold text-sm ${
                    isUpward ? "text-green-400" : "text-red-400"
                  }`}
                >
                  RS {isUpward ? "+" : "-"}
                  {transaction.amount}
                </p>
                <span
                  className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full capitalize ${
                    transaction.paid
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-400/10 text-yellow-400"
                  }`}
                >
                  {transaction.paid ? "Paid" : "Not Paid"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
