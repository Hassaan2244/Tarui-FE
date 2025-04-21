import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
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
    <div className=" relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center">
      {loading && <Loader />}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-opacity opacity-80 hover:opacity-100"
      >
        <CircleArrowLeft className="w-5 h-5 mr-2" />
        <span>Go to home</span>
      </Link>
      <div className="bg-white/5 backdrop-blur-md border-white/20 rounded-2xl p-10  shadow-xl space-y-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-cyan-400 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-400/40 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Sign In
          </button>
        </form>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <Link to="/signup">
          <p className="text-cyan-400 text-center opacity-60 hover:opacity-100 mb-2">
            New to this platform? Signup
          </p>
        </Link>
      </div>
    </div>
  );
}
