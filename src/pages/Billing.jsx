import React, { useCallback, useEffect, useState } from "react";
import { Trash2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../components/Loader";
import {
  clearBillingState,
  createOpenSellTransaction,
} from "../redux/slices/billingSlice";
import { transactionSchema } from "../validation-schema/validation-schemas";
import { printReceiptViaQZ } from "../config/helperFunctions";
import { toast } from "react-toastify";
import Select from "react-select";
import { Controller } from "react-hook-form";

export default function Billing() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addProductError, setAddProductError] = useState(null);

  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const billingState = useSelector((state) => state.billing);
  const products = productState?.products?.data || [];
  const { setting } = useSelector((state) => state.billSetting);
  const preparedByOptions = setting?.preparedBy || [];

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
    context: { selectedProducts },
    defaultValues: { type: "Open Sell" },
  });

  const selectedProductId = watch("product");
  const quantity = watch("quantity");
  const price = watch("price");

  const handleAddProduct = useCallback(() => {
    setAddProductError(null);

    if (!selectedProductId || !quantity || !price) {
      setAddProductError("Please select a product, it's quantity and price!");
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProductId));
    if (!product) return;

    if (selectedProducts.some((p) => p.id === product.id)) {
      setAddProductError("This product is already added!");
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setAddProductError("Quantity must be a positive whole number.");
      return;
    }

    const parsedPrice = Number(price);

    if (parsedQuantity > product.qty || parsedQuantity < 1) {
      setAddProductError(
        "Quantity must be less than the total quantity or at least 1!"
      );
      return;
    }

    if (parsedPrice < 0) {
      setAddProductError("Price must be a positive number!");
      return;
    }

    const newProduct = {
      id: product.id,
      name: product.name,
      quantity: parsedQuantity,
      price: parsedPrice,
      description: product?.description,
      total: parsedQuantity * parsedPrice,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
    resetField("product", { defaultValue: "" });
    resetField("quantity");
    resetField("price");
  });

  const handleRemoveProduct = useCallback((id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  });

  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id)
  );

  const onSubmit = (data) => {
    if (selectedProducts.length === 0) {
      setAddProductError("At least one product must be added!");
      return;
    }

    const payload = {
      ...data,
      type: "Open Sell",
      selectedProducts,
      paid: true,
    };

    dispatch(createOpenSellTransaction(payload));
  };

  useEffect(() => {
    if (billingState.success) {
      toast.success(billingState.success);
      setSelectedProducts([]);
      reset();
      dispatch(clearBillingState());
      printReceiptViaQZ(billingState?.singletransaction, setting);
    }
    if (billingState.error) {
      toast.error(billingState.error);
      dispatch(clearBillingState());
    }
  }, [billingState.success, billingState.error]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {billingState?.loading && <Loader />}

      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-8 shadow-2xl space-y-6 w-full max-w-4xl mt-10">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
          Open Sell Transaction
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-4 gap-4 items-end">
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
              className="col-span-1 w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
            />
            <input
              type="number"
              min="1"
              placeholder="Price"
              {...register("price")}
              className="col-span-1 w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
          >
            Add Product
          </button>

          {errors.product && (
            <p className="text-pink-400 text-sm">{errors.product.message}</p>
          )}
          {errors.quantity && (
            <p className="text-pink-400 text-sm">{errors.quantity.message}</p>
          )}
          {errors.price && (
            <p className="text-pink-400 text-sm">{errors.price.message}</p>
          )}
          {addProductError && (
            <p className="text-pink-400 text-sm">{addProductError}</p>
          )}

          {selectedProducts.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">
                Selected Products
              </h3>
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white/10 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold mb-2">{p.name}</p>
                    <p className="mb-2 text-gray-300">{p.description}</p>
                    <p className="text-sm text-gray-300">
                      {p.quantity} units × {p.price.toLocaleString()} Rs ={" "}
                      {p.total.toLocaleString()} Rs
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
                  {selectedProducts
                    .reduce((sum, p) => sum + p.total, 0)
                    .toLocaleString()}{" "}
                  Rs
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Details
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white"
              placeholder="Optional notes..."
            />
            {errors.description && (
              <p className="text-pink-400 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prepared By <span className="text-pink-400">*</span>
            </label>
            <select
              {...register("preparedBy")}
              className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 appearance-none transition-all outline-none"
            >
              <option value="">Select Preparer</option>
              {preparedByOptions.map((name, index) => (
                <option key={index} value={name} className="text-black">
                  {name}
                </option>
              ))}
            </select>
            {errors.preparedBy && (
              <p className="mt-1 text-sm text-pink-400">
                {errors.preparedBy.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={billingState?.loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl flex items-center justify-center"
          >
            <span>Submit Open Sell</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
