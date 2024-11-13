export interface SearchContactRequest {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    page: number;
    size: number;
}

export interface CreateContactRequest {
    full_name: string;
    email: string;
    phone: string;
}
