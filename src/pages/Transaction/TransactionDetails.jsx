import { ArrowLeft } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import { formatDate } from "../../config/helperFunctions";

export default function TransactionDetail() {
  const billingState = useSelector((state) => state.billing);
  const { state } = useLocation();
  const { transaction } = state;

  const showProductTable = [
    "Breakage",
    "Open Sell",
    "Return",
    "Buy",
    "Sell",
  ].includes(transaction?.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {billingState?.loading && <Loader />}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/ledger/${transaction.ledgerId}`}
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Transaction Detail
          </h2>

          <div className="text-gray-300 space-y-2">
            <div>
              <strong>Type:</strong> {transaction?.type}
            </div>
            <div>
              <strong>Description:</strong> {transaction?.description}
            </div>
            <div>
              <strong>Ledger ID:</strong> {transaction?.ledgerId}
            </div>
            <div>
              <strong>Created At:</strong> {formatDate(transaction?.createdAt)}
            </div>
            <div>
              <strong>Running Balance:</strong> {transaction?.runningBalance}
            </div>
            {[
              "Credit Amount",
              "Debit Amount",
              "Open Sell",
              "Return",
              "Buy",
              "Sell",
            ].includes(transaction?.type) && (
              <div>
                <strong>Amount:</strong> {transaction?.amount}
              </div>
            )}
          </div>

          {showProductTable && transaction?.selectedProducts?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-white/10">
                  <thead className="bg-white/10 text-gray-300">
                    <tr>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Quantity</th>
                      {transaction?.type !== "Breakage" && (
                        <>
                          <th className="p-2">Unit Price</th>
                          <th className="p-2">Total</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.selectedProducts.map((product, idx) => (
                      <tr key={idx} className="border-t border-white/5">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.quantity}</td>
                        {transaction?.type !== "Breakage" && (
                          <>
                            <td className="p-2">{product.price}</td>
                            <td className="p-2">{product.total}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
