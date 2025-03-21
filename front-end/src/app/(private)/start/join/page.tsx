import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
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

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Digite o código de convite..."
                className="pl-10 h-12 bg-muted/40 border-0 shadow-none focus-visible:ring-1 text-sm"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              O código de convite é fornecido pelo administrador da empresa
            </p>
          </div>

          <Button className="w-full">Continuar</Button>
        </div>
      </div>
    </div>
  );
}
