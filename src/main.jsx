import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Home, Login, Signup } from "./pages/index.js";

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

      // Dashboard Routes
      {
        path: "dashboard",
        // element: <DashboardLayout />, // A layout component that includes the sidebar and common dashboard elements
        element: (
          <h1 className="text-center text-2xl font-bold text-white mt-10">
            Welcome to your dashboard!
          </h1>
        ),
        children: [
          {
            path: "student",
            // element: <StudentDashboard />,
            element: (
              <h1 className="text-center text-2xl font-bold text-white mt-10">
                Welcome to the Student Dashboard!
              </h1>
            ),
          },
          {
            path: "teacher",
            // element: <TeacherDashboard />,
            element: (
              <h1 className="text-center text-2xl font-bold text-white mt-10">
                Welcome to the Teacher Dashboard!
              </h1>
            ),
          },
          {
            path: "admin",
            // element: <AdminDashboard />,
            element: (
              <h1 className="text-center text-2xl font-bold text-white mt-10">
                Welcome to the Admin Dashboard!
              </h1>
            ),
          },
        ],
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
