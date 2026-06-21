import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const route = createBrowserRouter([{ path: "/", element: <App /> }]);

createRoot(document.getElementById("root")).render(
  // Wrap the App component with the Redux Provider and pass the store as a prop
  <Provider store={store}>
    <RouterProvider router={route} />
  </Provider>,
);
