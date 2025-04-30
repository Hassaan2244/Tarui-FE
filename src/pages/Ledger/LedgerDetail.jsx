import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleLedger } from "../../redux/slices/ledgerSlice";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../config/helperFunctions";
import Loader from "../../components/Loader";
import { ArrowLeft, EditIcon } from "lucide-react";

export default function LedgerDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ledgerState = useSelector((state) => state.ledger);
  const singleLedger = ledgerState?.singleLedger;

  useEffect(() => {
    dispatch(fetchSingleLedger(id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {ledgerState?.loading && <Loader />}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <Link
          to="/ledger"
          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>

        <Link
          to={`/billing/add`}
          state={{ ledger: singleLedger }}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
        >
          <EditIcon className="w-5 h-5 mr-2" />
          <span>Create Transaction</span>
        </Link>
      </div>
      <div className="max-w-6xl mx-auto mt-5">
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2 wrap-break-word">
            {singleLedger?.name}
          </h1>
          <p className="text-gray-400 mt-1 wrap-break-word">
            {singleLedger?.description}
          </p>
          <div className="mt-6">
            <div className="text-gray-400">
              <strong>Created At:</strong> {formatDate(singleLedger?.createdAt)}
            </div>
            <div className="text-gray-400">
              <strong>Last Updated At:</strong>{" "}
              {formatDate(singleLedger?.updatedAt)}
            </div>
            <div className="mt-4">
              <h3 className="text-xl text-cyan-400">Transactions</h3>
              <div className="mt-2">
                {singleLedger?.Transactions?.length > 0 ? (
                  singleLedger?.Transactions.map((transaction, index) => (
                    <div key={index} className="text-gray-300">
                      <p>
                        <strong>Amount:</strong> {transaction.amount}
                      </p>
                      <p>
                        <strong>Details:</strong> {transaction.details}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No transactions available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
