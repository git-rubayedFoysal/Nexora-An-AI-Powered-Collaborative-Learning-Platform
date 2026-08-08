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
  LearningPage,
  AssignmentsPage,
  AssignmentDetail,
  GradeCenter,
  Profile,
  AdminUsers,
  AdminEnrollments,
  AdminRolesAccess,
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

// All routes for the app
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
      {
        path: "my-learning/:courseId",
        element: (
          <ProtectedRoute requireAuth>
            <RoleRoute allowedRoles={["student"]}>
              <LearningPage />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Dashboard routes (need to be logged in)
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
        element: <AssignmentsPage />,
      },
      {
        path: "assignments/:assignmentId",
        element: (
          <RoleRoute allowedRoles={["teacher", "admin", "student"]}>
            <AssignmentDetail />
          </RoleRoute>
        ),
      },
      {
        path: "grade",
        element: (
          <RoleRoute allowedRoles={["teacher"]}>
            <GradeCenter />
          </RoleRoute>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "users",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </RoleRoute>
        ),
      },
      {
        path: "enrollment",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminEnrollments />
          </RoleRoute>
        ),
      },
      {
        path: "role-access",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminRolesAccess />
          </RoleRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  // Wrap app with Redux provider
  <Provider store={store}>
    <AuthInitializer />
    <RouterProvider router={route} />
  </Provider>,
);
