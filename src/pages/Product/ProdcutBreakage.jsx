import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, CircleArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  createBreakageTransaction,
  createTransaction,
} from "../../redux/slices/billingSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "../../validation-schema/validation-schemas";

export default function ProdcutBreakage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addproductErrors, setAddproductErrors] = useState(null);
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const billingState = useSelector((state) => state.billing);
  const products = productState?.products?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: { type: "Breakage" },
    context: { selectedProducts },
  });

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);

  const selectedProductId = watch("product");
  const quantity = watch("quantity");

  const onSubmit = (data) => {
    if (selectedProducts.length === 0) {
      setAddproductErrors("At least one product must be added.");
      return;
    }

    const payload = {
      type: "Breakage",
      selectedProducts,
      description: data.description || "",
    };

    dispatch(createBreakageTransaction(payload));
  };

  const handleAddProduct = useCallback(() => {
    setAddproductErrors(null);
    if (!selectedProductId || !quantity) {
      setAddproductErrors("Please select a product and it's quantity!");
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProductId));
    if (!product) return;

    if (selectedProducts.some((p) => p.id === product.id)) {
      setAddproductErrors("This product is already added.");
      return;
    }

    const parsedQuantity = Number(quantity);
    if (parsedQuantity > product.qty || parsedQuantity < 1) {
      setAddproductErrors(
        `Quantity must be between 1 and available stock (${product.qty})`
      );
      return;
    }

    const newProduct = {
      id: product.id,
      name: product.name,
      quantity: parsedQuantity,
      price: 1,
      total: parsedQuantity * 1,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
    resetField("product");
    resetField("quantity");
  });

  const handleRemoveProduct = useCallback((id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  });

  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id)
  );

  useEffect(() => {
    if (billingState?.success) {
      reset();
      setSelectedProducts([]);
    }
  }, [billingState?.success]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {billingState?.loading && <Loader />}

      <Link
        to={`/product`}
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Products</span>
      </Link>

      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-8 shadow-2xl space-y-6 w-full max-w-4xl mt-10">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
          Report Breakage
        </h2>

        <div className="text-gray-300 text-sm text-center">
          <strong>Ledger:</strong> Breakage
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 items-end">
            <select
              {...register("product")}
              className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/10 focus:border-cyan-400/50"
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
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white"
            />
          </div>

          {errors.product && (
            <p className="text-pink-400 text-sm">{errors.product.message}</p>
          )}
          {errors.quantity && (
            <p className="text-pink-400 text-sm">{errors.quantity.message}</p>
          )}
          {addproductErrors && (
            <p className="text-pink-400 text-sm">{addproductErrors}</p>
          )}

          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
          >
            Add Product
          </button>

          {selectedProducts.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">
                Selected Breakage Items
              </h3>
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white/10 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold mb-2">{p.name}</p>
                    <p className="text-sm text-gray-300">
                      {p.quantity} × 1 = {p.total} rs
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
              <div className="flex justify-between items-center bg-white/20 p-3 rounded-lg border border-cyan-400/30">
                <p className="font-semibold text-cyan-300">Total</p>
                <p className="font-bold text-lg">
                  {selectedProducts.reduce((sum, p) => sum + p.total, 0)} rs
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes / Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white"
              placeholder="Describe what happened..."
              defaultValue={""}
            />
            {errors.description && (
              <p className="text-pink-400 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={billingState?.loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl flex items-center justify-center"
          >
            <span>Submit Breakage Report</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </form>

        {billingState?.error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-center text-red-300">
            {billingState?.error}
          </div>
        )}
        {billingState?.success && (
          <div className="m-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-center text-green-300">
            {billingState?.success}
          </div>
        )}
      </div>
    </div>
  );
}
