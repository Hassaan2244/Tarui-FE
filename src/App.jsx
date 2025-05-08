import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PublicLayout from "./components/PublicRoute";
import Ledger from "./pages/Ledger/Ledger";
import Billing from "./pages/Billing";
import AddLedger from "./pages/Ledger/AddLedger";
import Sidebar from "./components/Sidebar";
import LedgerDetail from "./pages/Ledger/LedgerDetail";
import Products from "./pages/Product/Product";
import AddProduct from "./pages/Product/Addproduct";
import ProductDetail from "./pages/Product/ProductDetail";
import EditProduct from "./pages/Product/EditProduct";
import Transaction from "./pages/Transaction/Transaction";
import TransactionDetail from "./pages/Transaction/TransactionDetails";
import ProdcutBreakage from "./pages/Product/ProdcutBreakage";
import BillSetting from "./pages/BillSetting";

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
          <Route path="/product/breakage" element={<ProdcutBreakage />} />
          <Route path="/product/edit" element={<EditProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/** Billing routes */}
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/add" element={<Transaction />} />
          <Route path="/billing/:id" element={<TransactionDetail />} />
          <Route path="/billing/setting" element={<BillSetting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
