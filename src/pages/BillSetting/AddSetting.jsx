import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { createSetting } from "../../redux/slices/billSettingSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { billSettingSchema } from "../../validation-schema/validation-schemas";

export default function AddSetting() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.billSetting);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(billSettingSchema),
  });

  const onSubmit = (data) => {
    dispatch(createSetting(data));
  };

  useEffect(() => {
    if (success) {
      reset();
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      {loading && <Loader />}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-all group mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Create Bill Setting
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {["icon", "name", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  {...register(field)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-400 transition-all outline-none"
                  placeholder={`Enter ${field}`}
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-pink-400">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                <span>Create Setting</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 mt-4 bg-red-900/30 border border-red-500/50 rounded-lg text-center text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="m-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-center text-green-300">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
