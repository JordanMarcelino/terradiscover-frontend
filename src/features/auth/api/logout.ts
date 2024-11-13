import { WebResponse } from "@/@types/api";
import axios, { AxiosResponse } from "axios";

export const logoutMutation = async (): Promise<WebResponse<object>> => {
    const response: AxiosResponse<WebResponse<object>> = await axios.post("/auth/logout", null, { withCredentials: true });

    return response.data;
};
