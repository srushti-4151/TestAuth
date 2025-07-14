import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/AuthSlice.js";

const Signup = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      console.log("Signup success");
    } catch (err) {
      console.log("Signup failed", err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input
          placeholder="Username"
          {...register("username", { required: "Username required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          placeholder="Email"
          {...register("email", {
            required: "Email required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm Password required",
            validate: (val) => val === password || "Passwords don't match",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
