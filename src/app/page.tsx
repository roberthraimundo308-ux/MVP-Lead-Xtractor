import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CRM Leads | VezaLeads',
    description: 'Manage your CRM leads.',
};

const leads = [
  { name: 'Prospecto Alfa', value: 'R$ 25.000', stage: 'Qualificação', owner: 'Ana', ownerInitials: 'A' },
  { name: 'Cliente Potencial Bravo', value: 'R$ 5.000', stage: 'Proposta', owner: 'Carlos', ownerInitials: 'C' },
  { name: 'Lead Charlie', value: 'R$ 55.000', stage: 'Negociação', owner: 'Sofia', ownerInitials: 'S' },
  { name: 'Contato Delta', value: 'R$ 12.000', stage: 'Fechado Ganho', owner: 'Ana', ownerInitials: 'A' },
  { name: 'Empresa Echo', value: 'R$ 8.000', stage: 'Qualificação', owner: 'Miguel', ownerInitials: 'M' },
  { name: 'Organização Foxtrot', value: 'R$ 30.000', stage: 'Proposta', owner: 'Carlos', ownerInitials: 'C' },
  { name: 'Companhia Golf', value: 'R$ 18.000', stage: 'Fechado Perdido', owner: 'Sofia', ownerInitials: 'S' },
  { name: 'Parceiro Hotel', value: 'R$ 7.500', stage: 'Qualificação', owner: 'Ana', ownerInitials: 'A' },
];

function getStageBadgeVariant(stage: string): "default" | "destructive" | "secondary" | "outline" {
    switch (stage) {
        case 'Fechado Ganho': return 'default';
        case 'Fechado Perdido': return 'destructive';
        case 'Proposta':
        case 'Negociação':
            return 'secondary';
        case 'Qualificação':
        default:
            return 'outline';
    }
}

export default function HomePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CRM Leads</h1>
          <p className="text-muted-foreground">Visão geral dos seus leads de vendas.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
            </Button>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Lead
            </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {leads.map((lead, index) => (
          <Card key={index} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
              <CardDescription className="text-primary font-semibold">{lead.value}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge variant={getStageBadgeVariant(lead.stage)}>{lead.stage}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Proprietário</p>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lead.owner}</span>
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-secondary">{lead.ownerInitials}</AvatarFallback>
                    </Avatar>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
