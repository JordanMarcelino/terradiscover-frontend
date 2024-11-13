import { WebResponse } from "@/@types/api";
import { RegisterRequest } from "@/@types/user/request";
import { UserResponse } from "@/@types/user/response";
import axios, { AxiosResponse } from "axios";

export const registerMutation = async (payload: RegisterRequest): Promise<WebResponse<UserResponse>> => {
    const response: AxiosResponse<WebResponse<UserResponse>> = await axios.post("/auth/register", payload);

    return response.data;
};
