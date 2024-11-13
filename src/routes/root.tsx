import { createBrowserRouter, redirect } from "react-router-dom";
import { redirectIfAuthenticated, requireAuth } from "./loader";
import { Register } from "./register";
import { Login } from "./login";
import { ContactView } from "@/features/contact/components/contact-view";
import { MainLayout } from "@/components/layout/main-layout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        loader: redirectIfAuthenticated,
    },
    {
        path: "/register",
        element: <Register />,
        loader: redirectIfAuthenticated,
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: "/contact",
                element: <ContactView />,
                loader: requireAuth,
            },
        ],
    },
    {
        path: "*",
        loader: () => redirect("/login"),
    },
]);
