import { Link, useParams } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader";
import { fetchTransactions } from "../../redux/slices/billingSlice";
import { formatDate } from "../../config/helperFunctions";

export default function TransactionList({ id = "" }) {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const transactions = billingState?.transactions?.data;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        id,
        page: currentPage + 1,
        search: debouncedSearch,
      })
    );
  }, [currentPage, debouncedSearch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="hidden md:grid md:grid-cols-5 bg-white/5 border-b border-white/10 p-4 text-gray-400 text-sm font-medium">
            <div>Transaction Type</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Description</div>
            <div className="text-center">Date</div>
            <div className="text-right">Running Balance</div>
          </div>

          {/* Table Rows */}
          {transactions?.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col md:grid md:grid-cols-5 border-b border-white/10 hover:bg-white/5 p-4 text-sm"
            >
              <div>
                <span className="md:hidden text-gray-400">Type:</span>
                <Link
                  to={`/billing/${transaction.id}`}
                  state={{ transaction: transaction }}
                >
                  <h3 className="font-semibold text-white">
                    {transaction.type}
                  </h3>
                </Link>
              </div>

              <div className="md:text-center">
                <span className="md:hidden text-gray-400">Amount:</span>
                <div className="text-white">{transaction.amount}</div>
              </div>

              <div className="md:text-center">
                <span className="md:hidden text-gray-400">Description:</span>
                <div className="text-white">{transaction.description}</div>
              </div>

              <div className="md:text-center">
                <span className="md:hidden text-gray-400">Date:</span>
                <div className="text-white">
                  {formatDate(transaction.createdAt)}
                </div>
              </div>

              <div className="text-right mt-2 md:mt-0">
                <span className="md:hidden block text-gray-400">
                  Running Balance:
                </span>
                <div className="text-white">
                  {transaction.runningBalance ?? "0.00"}
                </div>
              </div>
            </div>
          ))}
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
