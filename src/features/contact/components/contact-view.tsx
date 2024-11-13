import React from "react";
import { CreateContactForm } from "./create-contact-form";
import { Toaster } from "@/components/ui/toaster";
import { SearchContact } from "./search-contact";

export const ContactView: React.FC = () => {
    return (
        <>
            <Toaster />
            <SearchContact />
            <CreateContactForm />
        </>
    );
};
