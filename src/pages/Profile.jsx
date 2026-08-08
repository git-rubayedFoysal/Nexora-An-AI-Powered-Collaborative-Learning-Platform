/**
 * Profile
 *
 * Dashboard page for viewing and editing the user's profile.
 * Shows user info (name, email, role, member since) and
 * allows editing the display name.
 */

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateProfile } from "../features/auth/authSlice";
import { Button } from "../components/index";
import formatDate from "../utils/formatDate";

function Profile() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: userData?.full_name || "",
    },
  });

  async function onSubmit(data) {
    setSuccess("");
    setError("");
    try {
      await dispatch(updateProfile({ fullName: data.fullName })).unwrap();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  }

  // Derive initials from full name
  const initials = (userData?.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleColors = {
    student: "bg-teal/15 text-teal border-teal/25",
    teacher: "bg-amber/15 text-amber border-amber/25",
    admin: "bg-coral/15 text-coral border-coral/25",
  };

  const roleColor = roleColors[userData?.role] || roleColors.student;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-8 font-display">
        My <span className="gradient-text">Profile</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Profile card ── */}
        <div className="glass rounded-2xl border border-white/6 p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-violet-500 to-teal flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-[0_0_20px_rgba(124,90,247,.3)]">
            {initials}
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            {userData?.full_name || "User"}
          </h2>
          <p className="text-xs text-slate mt-0.5">{userData?.email}</p>
          <span
            className={`inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-semibold border ${roleColor}`}
          >
            {(userData?.role || "student").charAt(0).toUpperCase() +
              (userData?.role || "student").slice(1)}
          </span>
        </div>

        {/* ── Edit form ── */}
        <div className="lg:col-span-2 glass rounded-2xl border border-white/6 p-6">
          <h3 className="text-sm font-bold text-white font-display mb-5">
            Edit Profile
          </h3>

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-teal/25 bg-teal/5 px-5 py-4 mb-4">
              <svg
                className="w-4 h-4 text-teal shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-teal">{success}</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral-dim px-5 py-4 mb-4">
              <svg
                className="w-4 h-4 text-coral shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-coral">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="w-full px-4 py-2.5 rounded-xl text-sm
                           bg-white/5 border border-white/8 text-white
                           placeholder:text-slate-dark outline-none
                           focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                           transition-all"
              />
              {errors?.fullName && (
                <p className="mt-1.5 text-xs text-coral font-mono">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={userData?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl text-sm
                           bg-white/5 border border-white/8 text-slate-dark
                           cursor-not-allowed"
              />
              <p className="mt-1 text-[10px] text-slate-dark">
                Email cannot be changed.
              </p>
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={
                  (userData?.role || "student").charAt(0).toUpperCase() +
                  (userData?.role || "student").slice(1)
                }
                disabled
                className="w-full px-4 py-2.5 rounded-xl text-sm
                           bg-white/5 border border-white/8 text-slate-dark
                           cursor-not-allowed"
              />
              <p className="mt-1 text-[10px] text-slate-dark">
                Role is assigned by an administrator.
              </p>
            </div>

            {/* Member since */}
            {userData?.created_at && (
              <div>
                <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
                  Member Since
                </label>
                <input
                  type="text"
                  value={formatDate(userData.created_at)}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl text-sm
                             bg-white/5 border border-white/8 text-slate-dark
                             cursor-not-allowed"
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                           bg-violet hover:bg-violet-dark
                           shadow-[0_4px_16px_rgba(124,90,247,0.3)] transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
