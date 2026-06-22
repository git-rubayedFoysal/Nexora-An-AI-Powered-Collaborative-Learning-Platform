import authService from "../services/supabase/auth.service";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index";

function Login() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // log in a user with email, password redirect to the role based dashboard
  const login = async (data) => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await authService.signIn(data.email, data.password);

      if (!result?.user) {
        setError("Invalid email or password");
        return;
      }

      if (!result.user.email_confirmed_at) {
        navigate("/verify-email");
        return;
      }
      const userData = await authService.getCurrentUserDetails();
      console.log("User:", userData);
      const role = userData?.role?.toLowerCase();

      if (role == "student") {
        navigate("/dashboard/student");
      } else if (role == "teacher") {
        navigate("/dashboard/teacher");
      } else if (role == "admin") {
        navigate("/dashboard/admin");
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
    <div className="glass2 rounded-xl p-8 shadow-[0_32px_80px_rgba(0,0,0,.5)]">
      <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>
      <p className="text-sm text-slate text-center mb-8">
        Sign in to continue learning.
      </p>
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(login)}>
        <div className="space-y-4 mt-4">
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
            className="w-full mt-4 btn-violet flex justify-center items-center gap-2"
            disabled={loading}
          >
            Sign In{" "}
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </div>
        <div class="pt-4 text-center text-xs text-slate">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-violet-light hover:text-violet transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
