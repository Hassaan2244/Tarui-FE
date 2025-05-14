import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { productSchema } from "../../validation-schema/validation-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  clearProductState,
  updateProduct,
} from "../../redux/slices/productSlice";
import { toast } from "react-toastify";

export default function EditProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading, error, success } = useSelector((state) => state.product);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: state?.product?.name || "",
      description: state?.product?.description || "",
      price: state?.product?.price || "",
      qty: state?.product?.qty || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(updateProduct({ id: state.product.id, ...data }));
  };

  useEffect(() => {
    if (success) {
      dispatch(clearProductState());
      toast.success(success);
      reset();
      navigate("/product");
    }
    if (error) {
      toast.error(error);
      dispatch(clearProductState());
    }
  }, [success, error]);

  if (!state?.product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-2xl">
        No product data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {loading && <Loader />}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/product"
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Edit Product
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name
              </label>
              <input
                type="text"
                disabled={true}
                {...register("name")}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                placeholder="Product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                placeholder="Product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                {...register("qty")}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                placeholder="Quantity"
              />
              {errors.qty && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.qty.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                <span>Update Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
