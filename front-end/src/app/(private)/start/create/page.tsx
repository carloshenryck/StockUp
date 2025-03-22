"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchLocal } from "@/lib/fetchLocal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome não pode estar vazio" })
    .max(50, { message: "O nome deve possuir no máximo 50 caracteres" }),
});

export default function CreateCompanyPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetchLocal(
      "/invitation-code/join-company",
      "POST",
      values
    );

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
          <div className="flex items-center mb-4">
            <Link href="/start">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 -ml-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-medium">Criar Empresa</h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nome da empresa"
                              maxLength={6}
                              className="pl-10 h-12 bg-muted/70 border-0 shadow-none focus-visible:ring-1 text-sm"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Crie uma empresa e convide colaboradores
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
