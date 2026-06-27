import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Logo } from "../components/index";

function VerifyEmail() {
  const userData = useSelector((state) => state.auth.userData);
  const email = userData?.email || "your email";

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/6 h-17 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="glass w-full max-w-md rounded-3xl border border-white/6 p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,.45)]">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
            <span className="text-4xl">📧</span>
          </div>

          <h1
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Verify your email
          </h1>

          <p className="text-slate leading-relaxed">
            We've sent a verification link to
          </p>

          <p className="mt-2 text-white font-semibold break-all">{email}</p>

          <p className="mt-6 text-sm text-slate leading-relaxed">
            Please check your inbox and click the verification link to activate
            your account. After verifying your email, you can sign in and start
            using Nexora LMS.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-violet px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
