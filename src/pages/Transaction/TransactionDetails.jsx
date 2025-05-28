import { ArrowLeft } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import { formatDate, printInvoice } from "../../config/helperFunctions";
import Invoice from "../../components/Invoice";

export default function TransactionDetail() {
  const billingState = useSelector((state) => state.billing);
  const { setting } = useSelector((state) => state.billSetting);
  const { state } = useLocation();
  const { transaction } = state;
  const showProductTable = [
    "Breakage",
    "Open Sell",
    "Return-In",
    "Return-Out",
    "Buy",
    "Sell",
  ].includes(transaction?.type);
  const from = state?.from;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {billingState?.loading && <Loader />}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={from || `/ledger/${transaction.ledgerId}`}
            state={{ singleLedger: state.singleLedger }}
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </div>

        <div className=" backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl space-y-4">
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
              <strong>Paid:</strong> {transaction?.paid ? "Yes" : "No"}
            </div>
            <div>
              <strong>Ledger ID:</strong> {transaction?.ledgerId}
            </div>
            <div>
              <strong>Created At:</strong> {formatDate(transaction?.createdAt)}
            </div>
            <div>
              <strong>Previous Balance:</strong> {transaction?.prevBalance}
            </div>
            <div>
              <strong>Running Balance:</strong> {transaction?.runningBalance}
            </div>
            {[
              "Credit Amount",
              "Debit Amount",
              "Open Sell",
              "Return-In",
              "Return-Out",
              "Buy",
              "Sell",
            ].includes(transaction?.type) && (
              <div>
                <strong>Amount:</strong> {transaction?.amount}
              </div>
            )}
          </div>
          <button
            className="mt-4 md:mt-0 md:ml-4  px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
            onClick={() =>
              printInvoice(<Invoice data={transaction} setting={setting} />)
            }
          >
            Print
          </button>
          {showProductTable && transaction?.selectedProducts?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-white/10">
                  <thead className="bg-white/10 text-gray-300">
                    <tr>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Description</th>
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
                        <td className="p-2">{product.description}</td>
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
