import authService from "../services/supabase/auth.service";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Radio } from "./index";

function Signup() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // sign up a new user with email, password, full name, and role
  const create = async (data) => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const result = await authService.signUp(
        data.email,
        data.password,
        data.fullname,
        data.role,
      );

      if (!result?.user) {
        setError("User registration failed");
        return;
      }

      navigate("/verify-email");
    } catch (error) {
      setError(error?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass2 rounded-xl p-8 shadow-[0_32px_80px_rgba(0,0,0,.5)]">
      <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
      <p className="text-sm text-slate text-center mb-8">
        Join thousands of learners on Nexora.
      </p>
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(create)}>
        <div className="space-y-5 mt-4">
          <Input
            label="Full Name"
            placeholder="Jhon Doe"
            type="text"
            {...register("fullname", { required: true })}
          />

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

          <p className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-2 text-center">
            {" "}
            Create Account As
          </p>
          <div className="flex justify-center gap-5 items-center">
            <Radio
              label="Student"
              value="student"
              {...register("role", { required: true })}
            />
            <Radio
              label="Teacher"
              value="teacher"
              {...register("role", { required: true })}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4 btn-violet flex justify-center items-center gap-2"
            disabled={loading}
          >
            Create Account{" "}
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
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-violet-light hover:text-violet transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
