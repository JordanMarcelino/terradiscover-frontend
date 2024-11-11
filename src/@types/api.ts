export interface WebResponse<T> {
    message: string;
    data: T;
    paging?: PageMetaData;
}

export interface ErrorResponse {
    message: string;
    errors?: FieldError[];
}

export interface PageMetaData {
    page: number;
    size: number;
    total_item: number;
    total_page: number;
    links: Links;
}

export interface Links {
    self: string;
    first: string;
    prev: string;
    next: string;
    last: string;
}

export interface FieldError {
    field: string;
    message: string;
}
