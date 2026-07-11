import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import {
  Home,
  Login,
  Signup,
  DashboardLayout,
  VerifyEmail,
  ErrorPage,
  CreateCourse,
  EditCourse,
  PublicCourses,
  CourseDetails,
  Checkout,
  EnrollmentSuccess,
} from "./pages/index.js";
import {
  DashboardHome,
  ProtectedRoute,
  RoleRoute,
  MyCourses,
  MyLearning,
  ManageCourses,
} from "./components/index.js";
import AuthInitializer from "./features/auth/AuthInitializer.js";

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
      {
        path: "courses",

        children: [
          {
            index: true,
            element: <PublicCourses />,
          },
          {
            path: ":courseId",
            element: <CourseDetails />,
          },
          {
            path: ":courseId/checkout",
            element: (
              <ProtectedRoute requireAuth>
                <Checkout />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "enrollment-success",
        element: (
          <ProtectedRoute requireAuth>
            <RoleRoute allowedRoles={["student"]}>
              <EnrollmentSuccess />,
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Dashboard Routes
  {
    path: "dashboard",
    element: (
      <ProtectedRoute requireAuth>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      {
        path: "my-courses",
        element: (
          <RoleRoute allowedRoles={["teacher"]}>
            <MyCourses />
          </RoleRoute>
        ),
      },
      {
        path: "manage-courses",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageCourses />
          </RoleRoute>
        ),
      },
      {
        path: "my-learning",
        element: (
          <RoleRoute allowedRoles={["student"]}>
            <MyLearning />
          </RoleRoute>
        ),
      },
      {
        path: "create-course",
        element: (
          <RoleRoute allowedRoles={["teacher"]}>
            <CreateCourse />
          </RoleRoute>
        ),
      },
      {
        path: "edit-course/:courseId",
        element: (
          <RoleRoute allowedRoles={["teacher", "admin"]}>
            <EditCourse />
          </RoleRoute>
        ),
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
      {
        path: "manage-courses",
        // element: <ManageCourses />,
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
