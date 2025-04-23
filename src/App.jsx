import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicRoute";
import Layout from "./components/Layout";
import Ledger from "./pages/Ledger";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import AddLedger from "./pages/AddLedger";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="" element={<Dashboard />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="ledger/add" element={<AddLedger />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
