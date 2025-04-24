import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleLedger } from "../../redux/slices/ledgerSlice";
import { useParams } from "react-router-dom";
import { formatDate } from "../../config/helperFunctions";

export default function LedgerDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ledgerState = useSelector((state) => state.ledger);
  const singleLedger = ledgerState?.singleLedger;
  console.log(ledgerState);

  useEffect(() => {
    dispatch(fetchSingleLedger(id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
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
