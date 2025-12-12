import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building, Plus } from "lucide-react";
import Link from "next/link";

export default function StartPage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-background">
        <CardHeader className="text-center">
          <CardTitle className="font-medium leading-none">Começar</CardTitle>
          <CardDescription className="text-sm">
            Escolha como deseja prosseguir
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-2">
          <Link href="/start/join">
            <Button
              variant="outline"
              className="w-full h-auto flex items-center gap-3 p-4 justify-start"
            >
              <Building className="h-5 w-5" />
              <div className="text-left">
                <div className="font-normal text-normal">
                  Entrar em uma Empresa
                </div>
                <span className="text-xs text-muted-foreground">
                  Entre em um espaço de trabalho existente
                </span>
              </div>
            </Button>
          </Link>

          <Link href="/start/create">
            <Button
              variant="outline"
              className="w-full h-auto flex items-center gap-3 p-4 justify-start"
            >
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div>Criar uma Empresa</div>
                <span className="text-xs text-muted-foreground">
                  Inicie um novo espaço de trabalho
                </span>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
