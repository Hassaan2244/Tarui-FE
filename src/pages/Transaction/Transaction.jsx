import React, { useEffect, useState } from "react";
import { CircleArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { createTransaction } from "../../redux/slices/billingSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { transactionSchema } from "../../validation-schema/validation-schemas";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Transaction() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    context: { selectedProducts },
  });
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const billingState = useSelector((state) => state.billing);
  const products = productState?.products?.data || [];

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts({}));
  }, []);

  const transactionType = watch("type");
  const selectedProductId = watch("product");
  const quantity = watch("quantity");
  const price = watch("price");

  const onSubmit = (data) => {
    const productRequiredTypes = [
      "Buy",
      "Sell",
      "Open Sell",
      "Return",
      "Breakage",
    ];

    if (
      productRequiredTypes.includes(data.type) &&
      selectedProducts.length === 0
    ) {
      alert("At least one product must be selected.");
      return;
    }
    const payload = {
      ...data,
      selectedProducts,
      ledgerId: state.ledger?.id,
    };
    dispatch(createTransaction(payload));
  };

  const handleAddProduct = () => {
    const isBreakage = transactionType === "Breakage";

    if (!selectedProductId || !quantity || (!isBreakage && !price)) return;

    const product = products.find((p) => p.id === parseInt(selectedProductId));
    if (!product) return;

    if (quantity > product.qty || quantity < 1) {
      alert(
        `Quantity cannot be more than available stock (${product.qty}) or smaller than 1`
      );
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedPrice = isBreakage ? 1 : Number(price);
    if (parsedPrice < 1) {
      alert(`Price should be a positive number.`);
      return;
    }

    const newProduct = {
      id: product.id,
      name: product.name,
      quantity: parsedQuantity,
      price: parsedPrice,
      total: parsedQuantity * parsedPrice,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);

    resetField("product");
    resetField("quantity");
    if (!isBreakage) {
      resetField("price");
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id)
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {billingState?.loading && <Loader />}

      <Link
        to="/dashboard"
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-8 shadow-2xl space-y-6 w-full max-w-5xl mt-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
            Create Transaction
          </h2>
        </div>
        <div className="text-gray-300">
          <strong>Ledger:</strong> {state.ledger?.name}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Radio Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {[
              "Buy",
              "Sell",
              "Credit Amount",
              "Debit Amount",
              "Breakage",
              "Open Sell",
              "Return",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option}
                  {...register("type", {
                    required: "Transaction type is required",
                  })}
                  className="accent-cyan-400"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="text-sm text-pink-400">{errors.type.message}</p>
          )}

          {/* Conditional Product Section */}
          {(transactionType === "Buy" ||
            transactionType === "Sell" ||
            transactionType === "Open Sell" ||
            transactionType === "Return" ||
            transactionType === "Breakage") && (
            <>
              <div className="grid grid-cols-3 gap-4 items-end">
                <select
                  {...register("product")}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 placeholder-gray-400 transition-all outline-none appearance-none"
                >
                  <option value="">Select Product</option>
                  {availableProducts.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      className="text-black"
                    >
                      {product.name} (Qty: {product.qty})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  {...register("quantity")}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                />

                {transactionType !== "Breakage" && (
                  <>
                    <input
                      type="number"
                      min="1"
                      placeholder="Price"
                      {...register("price")}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                    />
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
              >
                Add Product
              </button>
              {transactionType !== "Breakage" && (
                <>
                  {errors.price && (
                    <p className="mt-1 text-sm text-pink-400">
                      {errors.price.message}
                    </p>
                  )}
                </>
              )}
              {errors.quantity && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.quantity.message}
                </p>
              )}
              {errors.product && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.product.message}
                </p>
              )}
              {/* Selected Products Table */}
              {selectedProducts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Selected Products
                  </h3>
                  <div className="space-y-2">
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center bg-white/10 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold mb-2">{p.name}</p>
                          <p className="text-sm text-gray-300">
                            {p.quantity} × {p.price.toLocaleString()} rs ={" "}
                            {p.total.toLocaleString()} rs
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(p.id)}
                          className="text-pink-400 hover:text-pink-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {/* Total Row */}
                    <div className="flex justify-between items-center bg-white/20 p-3 rounded-lg border border-cyan-400/30">
                      <p className="font-semibold text-cyan-300">Total</p>
                      <p className="font-bold text-lg">
                        {selectedProducts
                          .reduce((sum, p) => sum + p.total, 0)
                          .toLocaleString()}{" "}
                        rs
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Credit / Debit Amount Input */}
          {(transactionType === "Credit Amount" ||
            transactionType === "Debit Amount") && (
            <input
              type="number"
              placeholder="Amount"
              {...register("amount", {
                required: "Amount is required",
              })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
            />
          )}
          {errors.amount && (
            <p className="mt-1 text-sm text-pink-400">
              {errors.amount.message}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
              placeholder="Add notes about the transaction if you want..."
              defaultValue={""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-pink-400">
                {errors.description.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={billingState?.loading}
            className={`w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center ${
              billingState?.loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <span>Create Transaction</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}
