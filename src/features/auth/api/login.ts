import { WebResponse } from "@/@types/api";
import { LoginRequest } from "@/@types/user/request";
import { UserResponse } from "@/@types/user/response";
import axios, { AxiosResponse } from "axios";

export const loginMutation = async (payload: LoginRequest): Promise<WebResponse<UserResponse>> => {
    const response: AxiosResponse<WebResponse<UserResponse>> = await axios.post("/auth/login", payload, { withCredentials: true });

    return response.data;
};
