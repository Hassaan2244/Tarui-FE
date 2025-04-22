import { CircleArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validation-schema/validation-schemas";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState, signupUser } from "../redux/slices/authSlice";
import Loader from "../components/Loader";

export default function Signup() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    dispatch(signupUser({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearAuthState());
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center">
      {loading && <Loader />}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-opacity opacity-80 hover:opacity-100"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2" />
        <span>Go to home</span>
      </Link>
      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-10 shadow-xl space-y-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-cyan-400 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-400/40 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        {success && (
          <p className="text-green-400 text-center mt-2">
            {success} Redirecting to login...
          </p>
        )}
        <Link to="/login">
          <p className="text-cyan-400 text-center opacity-60 hover:opacity-100">
            Already have an account? Login
          </p>
        </Link>
      </div>
    </div>
  );
}
