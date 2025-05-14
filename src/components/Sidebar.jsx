import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useEffect } from "react";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchSetting } from "../redux/slices/billSettingSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.product);
  const products = productState.products?.data;
  const { setting } = useSelector((state) => state.billSetting);

  useEffect(() => {
    if (!products?.length > 0) dispatch(fetchProducts({}));
    if (!setting) dispatch(fetchSetting());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <aside className="w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 bg-black/40 backdrop-blur-md border-r border-white/20 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Sidebar
            </h1>
          </div>

          <nav className="flex flex-col p-4 space-y-2">
            <Link
              to="/dashboard"
              className="px-4 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center group"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3 group-hover:shadow-cyan-400/40 group-hover:shadow-sm"></div>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ledger"
              className="px-4 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center group"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-3 group-hover:shadow-purple-400/40 group-hover:shadow-sm"></div>
              <span>Ledger</span>
            </Link>

            <Link
              to="/billing"
              className="px-4 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center group"
            >
              <div className="w-2 h-2 rounded-full bg-gray-300 mr-3 group-hover:shadow-green-400/40 group-hover:shadow-sm"></div>
              <span>Billing</span>
            </Link>
            <Link
              to="/product"
              className="px-4 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center group"
            >
              <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 group-hover:shadow-green-400/40 group-hover:shadow-sm"></div>
              <span>Products</span>
            </Link>
            <Link
              to="/billing/setting"
              className="px-4 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center group"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 mr-3 group-hover:shadow-green-400/40 group-hover:shadow-sm"></div>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm">
        <Outlet />
      </main>
    </div>
  );
}
