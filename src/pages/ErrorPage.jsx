import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { Logo } from "../components/index";

function ErrorPage() {
  const error = useRouteError?.();
  const navigate = useNavigate();

  let status = 404;
  let title = "Page Not Found";
  let message = "The page you are looking for doesn't exist.";

  if (error) {
    if (isRouteErrorResponse(error)) {
      status = error.status;

      switch (status) {
        case 403:
          title = "Access Denied";
          message = "You don't have permission to access this page.";
          break;

        case 404:
          title = "Page Not Found";
          message = "The page you are looking for doesn't exist.";
          break;

        default:
          title = "Something Went Wrong";
          message = "An unexpected error occurred. Please try again later.";
      }
    } else {
      status = 500;
      title = "Something Went Wrong";
      message = "An unexpected error occurred. Please try again later.";
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/6 h-17 flex items-center px-6">
        <Logo />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="glass border border-white/6 rounded-3xl p-10 w-full max-w-md text-center">
          <h1 className="text-7xl font-bold text-violet-light mb-4">
            {status}
          </h1>

          <h2 className="text-2xl font-semibold text-white mb-3">{title}</h2>

          <p className="text-slate mb-8">{message}</p>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-violet text-white font-medium hover:bg-violet-light transition"
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}

export default ErrorPage;
