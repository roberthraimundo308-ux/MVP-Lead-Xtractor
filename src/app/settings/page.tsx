import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configurações | VezaLeads',
    description: 'Gerencie suas configurações e conta.',
};

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências.</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle>Perfil Público</CardTitle>
                    <CardDescription>Esta informação será exibida publicamente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                           <AvatarFallback className="text-3xl bg-secondary">EU</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Alterar foto</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" defaultValue="Usuário" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="usuario@veza.com" disabled />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Salvar alterações</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Escolha como você quer ser notificado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Configurações de notificação em breve.</p>
                </CardContent>
                <CardFooter>
                    <Button disabled>Salvar alterações</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="billing">
            <Card>
                <CardHeader>
                    <CardTitle>Faturamento</CardTitle>
                    <CardDescription>Gerencie suas informações de faturamento e plano.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Configurações de faturamento em breve.</p>
                </CardContent>
                <CardFooter>
                    <Button disabled>Atualizar plano</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
