import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Home, Login, Signup } from "./pages/index.js";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import { DashboardHome } from "./components/index.js";

// Define the routes for the application using React Router
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verify-email",
        // element: <VerifyEmail />,
        element: (
          <h1 className="text-center text-2xl font-bold text-white mt-10">
            Please check your email to verify your account.
          </h1>
        ),
      },
    ],
  },

  // Dashboard Routes
  {
    path: "dashboard",
    element: <DashboardLayout />,
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
    // element: <ErrorPage />,
    element: (
      <h1 className="text-center text-2xl font-bold text-white mt-10">
        404 - Page Not Found
      </h1>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  // Wrap the App component with the Redux Provider and pass the store as a prop
  <Provider store={store}>
    <RouterProvider router={route} />
  </Provider>,
);
