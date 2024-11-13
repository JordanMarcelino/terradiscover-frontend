import { WebResponse } from "@/@types/api";
import { SearchContactRequest } from "@/@types/contact/request";
import { ContactResponse } from "@/@types/contact/response";
import axios, { AxiosResponse } from "axios";

export const searchContactMutation = async (params: SearchContactRequest): Promise<WebResponse<ContactResponse[]>> => {
    if (!params.name) {
        params.name = "";
    }
    if (!params.email) {
        params.email = "";
    }
    if (!params.phone) {
        params.phone = "";
    }

    const response: AxiosResponse<WebResponse<ContactResponse[]>> = await axios.get(`/contacts?name=${params.name}&email=${params.email}&phone=${params.phone}&page=${params.page}&size=${params.size}`, { withCredentials: true });

    return response.data;
};
