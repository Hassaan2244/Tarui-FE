import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader";
import { fetchProducts } from "../../redux/slices/productSlice";

export default function Product() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const products = productState?.products?.data;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage + 1, search: debouncedSearch }));
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {productState?.loading && <Loader />}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2">
              Products
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all your inventory items
            </p>
          </div>
          <Link
            to="breakage"
            className="mt-4 md:mt-0 md:ml-4  px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Add Breakage</span>
          </Link>
          <Link
            to="add"
            className=" mt-4 md:mt-0 md:ml-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Add New Product</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-1 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-3 md:grid-cols-4 bg-white/5 border-b border-white/10 p-4 text-gray-400 text-sm font-medium">
            <div>Product Name</div>
            <div className="hidden md:block">Description</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Rows */}
          {products?.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-3 md:grid-cols-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors p-4"
            >
              <div>
                <h3 className="font-medium text-white break-words">
                  {product.name}
                </h3>
              </div>

              <div className="hidden md:block text-center text-cyan-400 break-words">
                {product.description}
              </div>
              <div className="text-center text-sm text-gray-400">
                {product.qty}
              </div>
              <div className="text-right">
                <Link
                  to={`/product/${product.id}`}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-end"
                >
                  <span className="inline">Details</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {productState?.products?.pages > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            breakLabel={"..."}
            pageCount={productState?.products?.pages}
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
