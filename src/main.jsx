import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/store.js";

import App from "./App.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import AuthLayout from "./Pages/AuthLayout.jsx";
import SignUp from "./Pages/SignUp.jsx"
import AllPost from "./Pages/AllPost.jsx"
import AddPost from "./Pages/AddPost.jsx"
import EditPost from "./Pages/EditPost.jsx"
import Post from "./Pages/Post.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authRequirement={true}>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authRequirement={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authRequirement={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "/all-post",
        element: (
          <AuthLayout authRequirement={true}>
            <AllPost />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authRequirement={true}>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authRequirement={true}>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <AuthLayout authRequirement={true}>
            <Post />
          </AuthLayout>
        )
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
);
