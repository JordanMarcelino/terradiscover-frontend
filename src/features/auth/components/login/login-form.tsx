import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { loginMutation } from "../../api/login";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/@types/api";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const schema = yup
    .object({
        email: yup.string().required("Email is required").email("Email format is not valid"),
        password: yup
            .string()
            .required("Password is required")
            .min(8, "Password must contain at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[@$!%*?&#]/, "Password must contain at least one special character"),
    })
    .required();

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isLoading },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutateAsync } = useMutation({
        mutationFn: loginMutation,
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        mutateAsync(data)
            .then((result) => {
                console.log(result);

                navigate("/contact");
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
                        title: "Failed Login Account",
                        description: description,
                        variant: "destructive",
                    });
                }
            });
    };

    return (
        <Card className="mx-auto w-[70%]">
            <Toaster />
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} id="email" type="email" placeholder="john.doe@gmail.com" className={cn(errors.email && "border-red-600  focus-visible:ring-red-600")} />
                            {errors.email && <p className="text-red-600 text-xs text-opacity-80">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input {...register("password")} id="password" type="password" className={cn(errors.password && "border-red-600  focus-visible:ring-red-600")} />
                            {errors.password && <p className="text-red-600 text-xs text-opacity-80">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className={cn("w-full")} disabled={!isValid || isSubmitting || isLoading}>
                            Login
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="underline">
                            Register
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
