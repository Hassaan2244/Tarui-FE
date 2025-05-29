import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader";
import { fetchTransactions } from "../../redux/slices/billingSlice";
import { formatDate } from "../../config/helperFunctions";

export default function TransactionList({ id = "", singleLedger = {} }) {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const transactions = billingState?.transactions?.data;

  useEffect(() => {
    dispatch(
      fetchTransactions({
        id,
        page: currentPage + 1,
        startDate: startDateTime,
        endDate: endDateTime,
      })
    );
  }, [currentPage, startDateTime, endDateTime]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const creditTypes = ["Credit Amount", "Sell", "Open Sell", "Return-Out"];
  const debitTypes = ["Debit Amount", "Buy", "Return-In"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {billingState?.loading && <Loader />}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2">
              Transactions
            </h1>
            <p className="text-gray-400 mt-1">
              View and manage transactions for this ledger.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="bg-white/30 text-white px-3 py-2 rounded-lg border border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="bg-white/30 text-white px-3 py-2 rounded-lg border border-white/20"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="hidden md:grid md:grid-cols-7 bg-white/5 border-b border-white/10 p-4 text-gray-400 text-sm font-medium">
            <div>Date</div>
            <div className="text-center">Description</div>
            <div className="text-center">Type</div>
            <div className="text-center">Credit</div>
            <div className="text-center">Debit</div>
            <div className="text-center">Paid</div>
            <div className="text-right">Running Balance</div>
          </div>

          {transactions?.map((transaction) => {
            const isCredit = creditTypes.includes(transaction.type);
            const isDebit = debitTypes.includes(transaction.type);

            return (
              <div
                key={transaction.id}
                className="flex flex-col md:grid md:grid-cols-7 border-b border-white/10 hover:bg-white/5 p-4 text-sm"
              >
                <div>
                  <span className="md:hidden text-gray-400">Date:</span>
                  <Link
                    to={`/billing/${transaction.id}`}
                    state={{ transaction, singleLedger }}
                  >
                    <div className="text-white">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </Link>
                </div>

                <div className="md:text-center">
                  <span className="md:hidden text-gray-400">Description:</span>
                  <div className="text-white break-words">
                    {transaction.description || "N/A"}
                  </div>
                </div>

                <div className="md:text-center">
                  <span className="md:hidden text-gray-400">Type:</span>
                  <Link
                    to={`/billing/${transaction.id}`}
                    state={{ transaction, singleLedger }}
                  >
                    <h3 className="font-semibold text-white">
                      {transaction.type}
                    </h3>
                  </Link>
                </div>

                <div className="md:text-center">
                  <span className="md:hidden text-gray-400">Credit:</span>
                  <div className="text-white">
                    {isCredit
                      ? Number(transaction.amount).toLocaleString()
                      : "-"}
                  </div>
                </div>

                <div className="md:text-center">
                  <span className="md:hidden text-gray-400">Debit:</span>
                  <div className="text-white">
                    {isDebit
                      ? Number(transaction.amount).toLocaleString()
                      : "-"}
                  </div>
                </div>

                <div className="md:text-center">
                  <span className="md:hidden text-gray-400">Paid:</span>
                  <div className="text-white">
                    {transaction.paid ? "Yes" : "No"}
                  </div>
                </div>

                <div className="text-right md:text-right mt-2 md:mt-0">
                  <span className="md:hidden block text-gray-400">
                    Running Balance:
                  </span>
                  <div className="text-white">
                    {Number(transaction.runningBalance || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {billingState?.transactions?.pages > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            breakLabel={"..."}
            pageCount={billingState?.transactions?.pages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName={"flex space-x-2 text-white"}
            pageLinkClassName="block px-4 py-2 rounded-xl transition-all hover:bg-white/10"
            activeLinkClassName="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
            previousLinkClassName="block px-4 py-2 rounded-xl transition-all hover:bg-white/10"
            nextLinkClassName="block px-4 py-2 rounded-xl transition-all hover:bg-white/10"
            breakLinkClassName="block px-4 py-2 rounded-xl text-gray-400"
            disabledLinkClassName="opacity-50 pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
