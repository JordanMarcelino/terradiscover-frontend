import { WebResponse } from "@/@types/api";
import { CreateContactRequest } from "@/@types/contact/request";
import { ContactResponse } from "@/@types/contact/response";
import axios, { AxiosResponse } from "axios";

export const createContactMutation = async (payload: CreateContactRequest): Promise<WebResponse<ContactResponse>> => {
    const response: AxiosResponse<WebResponse<ContactResponse>> = await axios.post("/contacts", payload, { withCredentials: true });

    return response.data;
};
