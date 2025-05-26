import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function PayInOut() {
  const payInData = [
    { source: "Wholesale Orders", amount: 15420.5 },
    { source: "Retail Sales", amount: 12350.75 },
    { source: "Custom Embroidery", amount: 8200.25 },
    { source: "Bulk Thread Sales", amount: 5500.0 },
    { source: "Needle Manufacturing", amount: 3200.8 },
  ];

  const payOutData = [
    { category: "Raw Materials", amount: 4500.0 },
    { category: "Manufacturing Costs", amount: 8200.0 },
    { category: "Shipping & Logistics", amount: 1200.5 },
    { category: "Equipment Maintenance", amount: 850.99 },
    { category: "Marketing & Sales", amount: 2100.25 },
  ];

  const totalPayIn = payInData.reduce((sum, i) => sum + i.amount, 0);
  const totalPayOut = payOutData.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex flex-wrap gap-6 mt-8 w-full">
      {/* Pay In */}
      <div className="w-full lg:w-[49%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-cyan-400">Top 5 Pay In</h2>
          <div className="bg-green-400/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="space-y-4">
          {payInData.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-green-400/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-white font-medium">{item.source}</p>
              </div>
              <p className="text-green-400 font-semibold">+${item.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-green-400/10 border border-green-400/20 p-4 rounded-xl">
          <p className="text-sm text-gray-300">Total Pay In</p>
          <p className="text-xl font-bold text-green-400">+${totalPayIn.toFixed(2)}</p>
        </div>
      </div>

      {/* Pay Out */}
      <div className="w-full lg:w-[49%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-cyan-400">Top 5 Pay Out</h2>
          <div className="bg-red-400/10 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
        </div>

        <div className="space-y-4">
          {payOutData.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-400/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-white font-medium">{item.category}</p>
              </div>
              <p className="text-red-400 font-semibold">-${item.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-red-400/10 border border-red-400/20 p-4 rounded-xl">
          <p className="text-sm text-gray-300">Total Pay Out</p>
          <p className="text-xl font-bold text-red-400">-${totalPayOut.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
