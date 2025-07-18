import React, { useCallback, useEffect, useState } from "react";
import { CircleArrowLeft, ArrowRight, Trash2, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  clearBillingState,
  createTransaction,
} from "../../redux/slices/billingSlice";
import { transactionSchema } from "../../validation-schema/validation-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import Invoice from "../../components/Invoice";
import { printInvoice } from "../../config/helperFunctions";
import Select from "react-select";
import { Controller } from "react-hook-form";


export default function Transaction() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addproductErrors, setAddproductErrors] = useState(null);
  const { state } = useLocation();
  const { singleLedger } = state;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    context: { selectedProducts },
    defaultValues: {
      paid: false,
    },
  });
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const billingState = useSelector((state) => state.billing);
  const { setting } = useSelector((state) => state.billSetting);
  const products = productState?.products?.data || [];
  const preparedByOptions = setting?.preparedBy || [];

  const transactionType = watch("type");
  const selectedProductId = watch("product");
  const quantity = watch("quantity");
  const price = watch("price");

  const onSubmit = (data) => {
    const productRequiredTypes = ["Buy", "Sell", "Return-In", , "Return-Out"];

    if (
      productRequiredTypes.includes(data.type) &&
      selectedProducts.length === 0
    ) {
      setAddproductErrors("At least one product must be selected.");
      return;
    }
    const payload = {
      ...data,
      selectedProducts,
      ledgerId: singleLedger?.id,
    };
    dispatch(createTransaction(payload));
  };

  const handleAddProduct = useCallback(() => {
    setAddproductErrors(null);
    const isBreakage = transactionType === "Breakage";
    const isBuy = transactionType === "Buy";
    const isReturnIn = transactionType === "Return-In";

    if (!selectedProductId || !quantity || !price) {
      setAddproductErrors("Please select a product, it's quantity and price!");
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

    if (
      !isBuy &&
      !isReturnIn &&
      (parsedQuantity > product.qty || parsedQuantity < 1)
    ) {
      setAddproductErrors(
        `Quantity cannot be more than available stock (${product.qty}) or smaller than 1`
      );
      return;
    }

    const parsedPrice = isBreakage ? 1 : Number(price);
    if (parsedPrice < 0) {
      setAddproductErrors(`Price should be a positive number.`);
      return;
    }

    const newProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      quantity: parsedQuantity,
      price: parsedPrice,
      total: parsedQuantity * parsedPrice,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);

    resetField("product", { defaultValue: "" });
    resetField("quantity");
    if (!isBreakage) {
      resetField("price");
    }
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
      printInvoice(
        <Invoice ledgerDetail={singleLedger} data={billingState?.singletransaction} setting={setting} />
      );
    }
    dispatch(clearBillingState());
  }, [billingState?.success]);

  useEffect(() => {
    setSelectedProducts([]);
    setAddproductErrors(null);
  }, [transactionType]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {billingState?.loading && <Loader />}

      <div className="absolute top-8 left-8 flex items-center justify-between w-full px-10">
        <Link
          to={`/ledger/${singleLedger?.id}`}
          state={{ singleLedger }}
          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
        >
          <CircleArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Ledger</span>
        </Link>

        <Link
          to="/product/add"
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-4 shadow-2xl space-y-6 w-full max-w-5xl mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
            Create Transaction
          </h2>
        </div>
        <div className="text-gray-300">
          <strong>Ledger:</strong> {singleLedger?.name}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Radio Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {[
              "Buy",
              "Sell",
              "Return-In",
              "Return-Out",
              "Credit Amount",
              "Debit Amount",
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
            transactionType === "Return-Out" ||
            transactionType === "Return-In") && (
            <>
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
                            backgroundColor: state.isFocused
                              ? "#bae6fd"
                              : "white",
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
                  step="1"
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
                className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
              >
                Add Product
              </button>

              {errors.price && (
                <p className="mt-1 text-sm text-pink-400">
                  {errors.price.message}
                </p>
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
              {addproductErrors && (
                <p className="mt-1 text-sm text-pink-400">{addproductErrors}</p>
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

                    {/* Total Row */}
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("paid")}
                      className="accent-cyan-400"
                      id="paid"
                    />
                    <h1 htmlFor="paid" className="text-gray-300">
                      Mark as Paid
                    </h1>
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
            disabled={billingState.loading}
            className={`w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center ${
              billingState?.loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <span>Create Transaction</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
        {billingState.error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-center text-red-300">
            {billingState?.error}
          </div>
        )}
        {billingState.success && (
          <div className="m-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-center text-green-300">
            {billingState?.success}
          </div>
        )}
      </div>
    </div>
  );
}
