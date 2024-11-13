import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CiCirclePlus } from "react-icons/ci";
import { createContactMutation } from "../api/create-contact";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/@types/api";
import { useStore } from "@/stores/store";

const schema = yup
    .object({
        full_name: yup.string().required("Full name is required"),
        email: yup.string().required("Email is required").email("Email format is not valid"),
        phone: yup
            .string()
            .required("Phone number is required")
            .matches(/^(\+62|62|08)[0-9]{8,12}$/, "Phone number format is not valid, starts with 62 or 08"),
    })
    .required();

export const CreateContactForm: React.FC = () => {
    const { toggleRefetch } = useStore();
    const { toast } = useToast();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isLoading },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
        },
    });

    const { mutateAsync } = useMutation({
        mutationFn: createContactMutation,
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        mutateAsync(data)
            .then(() => {
                toggleRefetch();
                toast({
                    title: "Success Create Contact",
                    variant: "success",
                });
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    const response = error.response.data as ErrorResponse;

                    let description;
                    if (response.errors) {
                        response.errors.map((fieldError) => {
                            description = `${fieldError.field}: ${fieldError.message}\n`;
                        });
                    } else {
                        description = response.message;
                    }

                    toast({
                        title: "Failed Create Contact",
                        description: description,
                        variant: "destructive",
                    });
                }
            });
        reset();
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className="fixed right-2 bottom-4 flex justify-center" asChild>
                    <Button className="rounded-full size-10 md:size-14">
                        <CiCirclePlus className="!size-6 md:!size-10" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create New Contact</AlertDialogTitle>
                        <AlertDialogDescription>Fill the contact details below.</AlertDialogDescription>

                        <form className="py-8" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Full name</Label>
                                    <Input {...register("full_name")} id="password" type="text" className={cn(errors.full_name && "border-red-600  focus-visible:ring-red-600")} placeholder="John Doe" />
                                    {errors.full_name && <p className="text-red-600 text-xs text-opacity-80">{errors.full_name.message}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input {...register("email")} id="email" type="email" placeholder="john.doe@gmail.com" className={cn(errors.email && "border-red-600  focus-visible:ring-red-600")} />
                                    {errors.email && <p className="text-red-600 text-xs text-opacity-80">{errors.email.message}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Phone number</Label>
                                    <Input {...register("phone")} id="password" type="text" className={cn(errors.phone && "border-red-600  focus-visible:ring-red-600")} placeholder="+62" />
                                    {errors.phone && <p className="text-red-600 text-xs text-opacity-80">{errors.phone.message}</p>}
                                </div>

                                <AlertDialogAction type="submit" className="bg-none !hover:bg-none" disabled={!isValid || isSubmitting || isLoading}>
                                    Create
                                </AlertDialogAction>
                            </div>
                        </form>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
