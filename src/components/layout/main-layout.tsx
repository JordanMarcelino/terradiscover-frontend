import { LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { logoutMutation } from "@/features/auth/api/logout";

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const { mutateAsync } = useMutation({
        mutationFn: logoutMutation,
    });

    const handleLogout = () => {
        mutateAsync().then(() => {
            navigate("/login");
        });
    };

    return (
        <>
            <div className="w-full pe-8 pt-8 flex gap-2 justify-end">
                <Button className="bg-red-600 hover:bg-red-800" onClick={handleLogout}>
                    <LogOut />
                    Log out
                </Button>
            </div>
            <Outlet />
        </>
    );
};
