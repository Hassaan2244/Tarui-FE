import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, CircleArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  clearBillingState,
  createBreakageTransaction,
} from "../../redux/slices/billingSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "../../validation-schema/validation-schemas";
import { toast } from "react-toastify";
import Select from "react-select";
import { Controller } from "react-hook-form";

export default function ProdcutBreakage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addproductErrors, setAddproductErrors] = useState(null);
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const billingState = useSelector((state) => state.billing);
  const products = productState.products?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: { type: "Breakage" },
    context: { selectedProducts },
  });

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
      ("Please select a product and it's quantity!");
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProductId));
    if (!product) return;

    if (selectedProducts.some((p) => p.id === product.id)) {
      setAddproductErrors("This product is already added.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setAddproductErrors("Quantity must be a positive whole number.");
      return;
    }

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
      description: product?.description,
      total: parsedQuantity * 1,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
    resetField("product", { defaultValue: "" });
    resetField("quantity");
  });

  const handleRemoveProduct = useCallback((id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  });

  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id)
  );

  useEffect(() => {
    if (billingState.success) {
      setSelectedProducts([]);
      reset();
      toast.success(billingState.success);
      dispatch(clearBillingState());
    }
    if (billingState.error) {
      toast.error(billingState.error);
      dispatch(clearBillingState());
    }
  }, [billingState.success, billingState.error]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {billingState.loading && <Loader />}

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
          <div className="grid grid-cols-3 gap-4 items-end">
            <Controller
              control={control}
              name="product"
              render={({ field }) => {
                const options = availableProducts.map((product) => ({
                  value: product.id,
                  label: `${product.name} - ${product.description} (Qty: ${product.qty})`,
                }));

                const selectedOption = options.find(
                  (opt) => opt.value === field.value
                );

                return (
                  <Select
                    {...field}
                    options={options}
                    value={selectedOption || null}
                    placeholder="Search & select product"
                    isSearchable
                    onChange={(selected) => field.onChange(selected?.value)}
                    classNamePrefix="react-select"
                    className="col-span-2"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderColor: state.isFocused
                          ? "rgba(34,211,238,0.5)"
                          : "rgba(255,255,255,0.1)",
                        boxShadow: state.isFocused
                          ? "0 0 0 1px rgba(34,211,238,0.3)"
                          : "none",
                        padding: "2px",
                        color: "white",
                        borderRadius: "0.5rem",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        color: "black",
                        zIndex: 20,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#bae6fd" : "white",
                        color: "black",
                        cursor: "pointer",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                      }),
                    }}
                  />
                );
              }}
            />

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              {...register("quantity")}
              className="col-span-1 w-full px-4 py-3 rounded-lg bg-white/5 text-white"
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
                    <p className="mb-2 text-gray-300">{p.description}</p>
                    <p className="text-sm text-gray-300">{p.quantity} units</p>
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
      </div>
    </div>
  );
}
