import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Home, Login, Signup } from "./pages/index.js";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import { DashboardHome } from "./components/index.js";
import AuthInitializer from "./features/auth/AuthInitializer.js";
import ProtectedRoute from "./components/AuthLayout.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

// Define the routes for the application using React Router
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
    ],
  },

  // Dashboard Routes
  {
    path: "dashboard",
    element: (
      <ProtectedRoute requireAuth>
        <DashboardLayout />,
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      {
        path: "courses",
        // element: <Courses />,
      },

      {
        path: "assignments",
        // element: <Assignments />,
      },

      {
        path: "quizzes",
        // element: <Quizzes />,
      },

      {
        path: "profile",
        // element: <Profile />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  // Wrap the App component with the Redux Provider and pass the store as a prop
  <Provider store={store}>
    <AuthInitializer />
    <RouterProvider router={route} />
  </Provider>,
);
