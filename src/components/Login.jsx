import authService from "../services/supabase/auth.service";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Logo } from "./index";

function Login() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await authService.signIn(data.email, data.password);

      const userData = await authService.getCurrentUserDetails();
      const role = (userData?.role || "").toLowerCase();
      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setError("User role is missing or invalid");
      }
    } catch (error) {
      setError(error?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <div className="w-full max-w-md border-2 px-6 py-8 rounded-lg bg-[#2a2a2a] border-[#3a3a3a] text-white">
        <div className="mb-8 mt-5 flex justify-center">
          <Logo width="100%" />
        </div>

        <h1 className="text-center text-3xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-400">
          Sign in to continue learning.
        </p>
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(login)}>
          <div className="space-y-5 mt-6">
            <Input
              label="Email"
              placeholder="your@example.com"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />

            <Input
              type="password"
              placeholder="........"
              label="Password"
              {...register("password", {
                required: true,
              })}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              bgColor="bg-blue-600"
              disabled={loading}
            >
              Sign In
            </Button>
          </div>
          <div class="pt-4">
            Don&apos;t have an account?&nbsp;
            <Link
              to="/signup"
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
