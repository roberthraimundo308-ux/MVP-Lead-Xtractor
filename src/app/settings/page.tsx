'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from 'next';

// This is a workaround for a hydration error until a fix is released.
// The `metadata` export is not used in this file but is required for the page to render.
// export const metadata: Metadata = {
//     title: 'Configurações | VezaLeads',
//     description: 'Gerencie suas configurações e conta.',
// };

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências.</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
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
        <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Configuração da API</CardTitle>
                <CardDescription>
                  Insira sua chave de API do Google Gemini para habilitar os recursos de IA.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Chave da API do Gemini</Label>
                  <Input 
                    id="api-key" 
                    type="password"
                    placeholder="Cole sua chave de API aqui"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h4 className="font-semibold mb-2">Como configurar</h4>
                  <p className="text-sm text-muted-foreground">
                    Para que a importação de leads funcione no aplicativo publicado (na Vercel), você precisa configurar esta chave como uma variável de ambiente.
                  </p>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 mt-3">
                    <li>Copie a chave de API que você colou no campo acima.</li>
                    <li>Vá para o painel do seu projeto na Vercel.</li>
                    <li>Navegue até a aba "Settings" e depois "Environment Variables".</li>
                    <li>Crie uma nova variável com o nome <code className="bg-background px-1.5 py-0.5 rounded text-foreground font-mono font-medium">GEMINI_API_KEY</code>.</li>
                    <li>Cole sua chave no campo de valor e salve.</li>
                    <li>Faça um novo deploy do seu projeto para que as alterações tenham efeito.</li>
                  </ol>
                  <Button variant="link" asChild className="p-0 h-auto mt-3 text-sm">
                    <a href="https://vercel.com/docs/projects/environment-variables" target="_blank" rel="noopener noreferrer">
                      Aprenda mais na documentação da Vercel &rarr;
                    </a>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                 <Button disabled>Salvar (configuração via Vercel)</Button>
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
