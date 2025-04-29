import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/slices/productSlice";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../config/helperFunctions";
import Loader from "../../components/Loader";
import { ArrowLeft, EditIcon } from "lucide-react";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const productState = useSelector((state) => state.product);
  const singleProduct = productState?.singleProduct;

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {productState?.loading && <Loader />}
      <div className="flex items-center mb-8">
        <Link
          to="/product"
          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group mr-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
        <Link
          to={`/product/edit`}
          state={{ product: singleProduct }}
          className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
        >
          <EditIcon className="w-5 h-5 mr-2" />
          <span>Edit Product</span>
        </Link>
      </div>
      <div className="max-w-6xl mx-auto mt-5">
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2 break-words">
            {singleProduct?.name}
          </h1>
          <p className="text-gray-400 mt-1 break-words">
            {singleProduct?.description}
          </p>
          <div className="mt-6 space-y-2">
            <div className="text-gray-400">
              <strong>Quantity Available:</strong> {singleProduct?.qty}
            </div>
            <div className="text-gray-400">
              <strong>Created At:</strong>{" "}
              {formatDate(singleProduct?.createdAt)}
            </div>
            <div className="text-gray-400">
              <strong>Last Updated At:</strong>{" "}
              {formatDate(singleProduct?.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
