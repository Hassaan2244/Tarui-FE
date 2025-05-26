import { AlertTriangle, Package } from "lucide-react";

export default function LowQuantityProducts() {
  const lowStockProducts = [
    { name: "Embroidery Needles Size 9", currentStock: 45, minStock: 200, category: "Needles" },
    { name: "Cotton Thread - Black", currentStock: 12, minStock: 50, category: "Thread" },
    { name: "Quilting Needles Set", currentStock: 8, minStock: 30, category: "Needles" },
    { name: "Silk Thread - Royal Blue", currentStock: 6, minStock: 25, category: "Thread" },
    { name: "Tapestry Needles Size 18", currentStock: 15, minStock: 75, category: "Needles" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">Low Quantity Products</h2>
        <div className="bg-red-400/10 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
      </div>

      <div className="space-y-4">
        {lowStockProducts.map((product, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-400/10 p-2 rounded-lg">
                <Package className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium">{product.name}</p>
                <p className="text-sm text-gray-400">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-400">Stock:</span>
              <span className="text-red-400 font-semibold">{product.currentStock}</span>
              <span className="text-gray-400">/ {product.minStock}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 py-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition">
        Manage Inventory
      </button>
    </div>
  );
}
