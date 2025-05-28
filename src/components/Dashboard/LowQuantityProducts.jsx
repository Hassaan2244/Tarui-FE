import { useMemo } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function LowQuantityProducts() {
  const productState = useSelector((state) => state.product);
  const products = productState.products?.data;

  const lowStockProducts = useMemo(() => {
    if (!products) return [];
    return products?.filter((product) => product.qty < 15);
  }, [products]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">
          Low Quantity Products
        </h2>
        <div className="bg-red-400/10 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
      </div>

      {lowStockProducts.length === 0 ? (
        <p className="text-gray-400 text-sm">
          All products have sufficient stock.
        </p>
      ) : (
        <div className="space-y-4">
          {lowStockProducts.map((product, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-cyan-400/10 p-2 rounded-lg">
                  <Package className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ singleProduct: product, from: location.pathname }}
                  >
                    <p className="text-white font-medium">{product.name}</p>
                  </Link>
                  <p className="text-sm text-gray-400">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-400">Stock:</span>
                <span className="text-red-400 font-semibold">
                  {product.qty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/product">
        <button className="w-full mt-5 py-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition">
          Manage Inventory
        </button>
      </Link>
    </div>
  );
}
