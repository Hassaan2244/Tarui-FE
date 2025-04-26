import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PublicLayout from "./components/PublicRoute";
import Ledger from "./pages/Ledger/Ledger";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import AddLedger from "./pages/Ledger/AddLedger";
import Sidebar from "./components/Sidebar";
import LedgerDetail from "./pages/Ledger/LedgerDetail";
import Products from "./pages/Product/Product";
import AddProduct from "./pages/Product/Addproduct";
import ProductDetail from "./pages/Product/ProductDetail";
import EditProduct from "./pages/Product/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<Sidebar />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/** Ledger routes */}
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/ledger/add" element={<AddLedger />} />
          <Route path="/ledger/:id" element={<LedgerDetail />} />

          {/** Product routes */}
          <Route path="/product" element={<Products />} />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product/edit" element={<EditProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/** Inventory routes */}
          <Route path="/inventory" element={<Inventory />} />

          {/** Billing routes */}
          <Route path="/billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
