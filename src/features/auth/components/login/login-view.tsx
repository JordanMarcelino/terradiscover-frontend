import { BackgroundLines } from "@/components/ui/background-lines";
import { LoginForm } from "./login-form";

export const LoginView: React.FC = () => {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 h-screen w-full items-center justify-center">
            <div className="relative">
                <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                    <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white text-3xl md:text-5xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                        Login <br />
                        Your Account
                    </h2>
                </BackgroundLines>
            </div>
            <LoginForm />
        </div>
    );
};
