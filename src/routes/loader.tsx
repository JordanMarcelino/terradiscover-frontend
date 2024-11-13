import { Cookies } from "react-cookie";
import { LoaderFunction, redirect } from "react-router-dom";

export const requireAuth: LoaderFunction = () => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");

    if (!token) {
        return redirect("/");
    }
    return null;
};

export const redirectIfAuthenticated: LoaderFunction = () => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");

    if (token) {
        return redirect("/contact");
    }
    return null;
};
