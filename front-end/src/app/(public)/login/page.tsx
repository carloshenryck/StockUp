"use client";

import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const googleLogin = () => {
    redirect("http://localhost:4000/auth/google/login");
  };

  return (
    <div className="w-full max-w-sm h-svh flex flex-col gap-4 justify-center mx-auto px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <Boxes size={32} strokeWidth={1} />
        <h1 className="text-xl">
          Bem vindo ao <span className="font-bold">StockUp</span>
        </h1>
      </div>

      <Button
        variant="default"
        type="button"
        className="w-full cursor-pointer"
        onClick={googleLogin}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Continuar com Google
      </Button>
    </div>
  );
}
