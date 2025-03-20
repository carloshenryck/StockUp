import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building, Plus } from "lucide-react";

export default function JoinCompany() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-background">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-medium">Começar</CardTitle>
          <CardDescription className="text-sm">
            Escolha como deseja prosseguir
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 pt-2">
          <div className="grid gap-3">
            <Button
              variant="outline"
              className="w-full h-auto flex items-center gap-3 p-4 justify-start hover:bg-muted"
            >
              <Building className="h-5 w-5" />
              <div className="text-left">
                <div className="font-normal">Entrar em uma Empresa</div>
                <span className="text-xs text-muted-foreground">
                  Entre em um espaço de trabalho existente
                </span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-auto flex items-center gap-3 p-4 justify-start hover:bg-muted"
            >
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-normal">Criar uma Empresa</div>
                <span className="text-xs text-muted-foreground">
                  Inicie um novo espaço de trabalho
                </span>
              </div>
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Você pode alterar isso depois nas configurações da sua conta
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
