import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CircleArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clearAuthState, loginUser } from "../redux/slices/authSlice";
import Loader from "../components/Loader";
import { loginSchema } from "../validation-schema/validation-schemas";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearAuthState());
        navigate("/dashboard");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className=" relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      {loading && <Loader />}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-all group"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-8  shadow-2xl space-y-6 w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent p-2">
            Log In to your Account
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
          />
          {errors.email && (
            <p p className="mt-1 text-sm text-pink-400">
              {errors.email.message}
            </p>
          )}
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
          />
          {errors.password && (
            <p p className="mt-1 text-sm text-pink-400">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-center text-red-300">
            {error}
          </div>
        )}
        {/* <div className="text-center text-sm text-gray-400">
          Nawa'n aya'n ay sohneya?{"  "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Sign up
          </Link>
        </div> */}
      </div>
    </div>
  );
}
