import { TrendingUp, Package, CreditCard } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    { title: "Total Revenue", value: "$45,231", icon: TrendingUp },
    { title: "Products in Stock", value: "1,234", icon: Package },
    { title: "Orders Processed", value: "856", icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/10 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="bg-cyan-400/10 p-3 rounded-xl">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
