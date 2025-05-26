import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";

export default function RecentTransactions() {
  const transactions = [
    { description: "Payment from Textile World Ltd", amount: 1250, type: "credit", date: "2024-01-15", status: "completed" },
    { description: "Cotton Thread Bulk Purchase", amount: 450.75, type: "debit", date: "2024-01-15", status: "completed" },
    { description: "Client Payment - Fashion House", amount: 3200, type: "credit", date: "2024-01-14", status: "completed" },
    { description: "Needle Manufacturing Equipment", amount: 899.99, type: "debit", date: "2024-01-14", status: "pending" },
    { description: "Embroidery Thread Supplier", amount: 675.5, type: "debit", date: "2024-01-13", status: "completed" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">Recent Transactions</h2>
        <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition" />
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${transaction.type === "credit" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                {transaction.type === "credit" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-400">{transaction.date}</p>
              </div>
            </div>

            <div className="text-right min-w-[110px]">
              <p className={`font-semibold text-sm ${transaction.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </p>
              <span className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full capitalize ${transaction.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
