"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchLocal } from "@/lib/fetchLocal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().length(6, { message: "O código deve possuir 6 caracteres" }),
});

export default function JoinCompanyPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetchLocal("/company/join", "POST", values);

    if (!response) {
      setIsLoading(false);
      return;
    }

    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link href="/start">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 -ml-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-medium">Entrar em uma Empresa</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Digite o código de convite que você recebeu para se juntar a uma
            empresa
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="XXXXXX"
                              maxLength={6}
                              className="pl-10 h-12 bg-muted/70 border-0 shadow-none focus-visible:ring-1 text-sm uppercase"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          O código de convite é fornecido pelo administrador da
                          empresa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? <Spinner /> : "Continuar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
