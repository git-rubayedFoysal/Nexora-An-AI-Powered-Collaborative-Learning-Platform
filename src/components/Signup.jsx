import authService from "../services/supabase/auth.service";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Logo, Select } from "./index";

function Signup() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const create = async (data) => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await authService.signUp(
        data.email,
        data.password,
        data.fullname,
        data.role,
      );

        navigate("/verify-email");
    } catch (error) {
      setError(error?.message || "Unable to create account");
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
          Create Account
        </h1>
        <p className="text-center text-sm text-gray-400">
          Join thousands of learners on Nexora.
        </p>
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5 mt-6">
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

            <Select
              label="Role"
              options={["Student", "Teacher", "Admin"]}
              {...register("role", { required: true })}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              bgColor="bg-blue-600"
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
          <div class="pt-4">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
