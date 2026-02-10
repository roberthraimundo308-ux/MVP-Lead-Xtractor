import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Plus, MoreHorizontal, Calendar, CheckSquare, MessageSquare, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Metadata } from 'next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
    title: 'CRM Leads | VezaLeads',
    description: 'Gerencie seus leads de CRM em um quadro Kanban.',
};

const columns = [
  {
    id: 'qualificacao',
    title: 'Qualificação',
    color: 'bg-gray-500',
    tasks: [
      { id: '1', title: 'Prospecto Alfa', description: 'Valor: R$ 25.000', date: '16 Outubro', ownerInitials: 'A', status: 'To-do', priority: 'Sem prioridade', subtasks: 3 },
      { id: '5', title: 'Empresa Echo', description: 'Valor: R$ 8.000', date: '18 Outubro', ownerInitials: 'M', status: 'To-do', priority: 'Sem prioridade' },
      { id: '8', title: 'Parceiro Hotel', description: 'Valor: R$ 7.500', date: '20 Outubro', ownerInitials: 'A', status: 'To-do', priority: 'Sem prioridade' },
    ]
  },
  {
    id: 'proposta',
    title: 'Proposta',
    color: 'bg-yellow-500',
    tasks: [
        { id: '2', title: 'Cliente Potencial Bravo', description: 'Valor: R$ 5.000', date: '17 Outubro', ownerInitials: 'C', status: 'Em andamento', priority: 'Sem prioridade' },
        { id: '6', title: 'Organização Foxtrot', description: 'Valor: R$ 30.000', date: '21 Outubro', ownerInitials: 'C', status: 'Em andamento', priority: 'Sem prioridade', comments: 3 },
    ]
  },
  {
    id: 'negociacao',
    title: 'Negociação',
    color: 'bg-blue-500',
    tasks: [
      { id: '3', title: 'Lead Charlie', description: 'Valor: R$ 55.000', date: '25 Outubro', ownerInitials: 'S', status: 'Em análise', priority: 'Sem prioridade', comments: 8, attachments: 2, subtasks: 1 },
    ]
  },
  {
    id: 'fechado',
    title: 'Fechado',
    color: 'bg-green-500',
    tasks: [
       { id: '4', title: 'Contato Delta', description: 'Valor: R$ 12.000', date: '10 Outubro', ownerInitials: 'A', status: 'Concluído', priority: 'Sem prioridade' },
       { id: '7', title: 'Companhia Golf', description: 'Valor: R$ 18.000', date: '11 Outubro', ownerInitials: 'S', status: 'Perdido', priority: 'Sem prioridade', subtasks: 3, comments: 1 },
    ]
  }
];

type TaskStatus = "Concluído" | "Perdido" | "Em andamento" | "Em análise" | "To-do";

function getStatusBadgeVariant(status: TaskStatus): "default" | "destructive" | "secondary" | "outline" {
    switch (status) {
        case 'Concluído': return 'default';
        case 'Perdido': return 'destructive';
        case 'Em andamento':
        case 'Em análise':
            return 'secondary';
        case 'To-do':
        default:
            return 'outline';
    }
}

export default function HomePage() {
  return (
    <div className="bg-muted/40 h-full">
      <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        <header className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM Leads</h1>
            <p className="text-muted-foreground">Gerencie seus leads no pipeline de vendas.</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Lead
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Adicionar novo lead</SheetTitle>
                <SheetDescription>
                  Preencha as informações abaixo para criar um novo lead. Clique em salvar quando terminar.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="InovaTech Soluções" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="inovatech.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="@inovatech" />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Salvar Lead</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-grow overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 pb-4 h-full">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                    <h2 className="font-semibold text-foreground">{column.title}</h2>
                    <span className="text-sm text-muted-foreground">{column.tasks.length}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {column.tasks.map((task) => (
                    <Card key={task.id} className="bg-card hover:shadow-md transition-shadow">
                      <CardHeader className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(task.status as TaskStatus)} className="capitalize">{task.status}</Badge>
                            <Badge variant="outline">{task.priority}</Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <h3 className="font-semibold text-card-foreground">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{task.date}</span>
                        </div>

                        {task.subtasks && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <CheckSquare className="h-4 w-4" />
                                <span>Ver {task.subtasks} subtarefas</span>
                            </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex justify-between items-center">
                        <Avatar className="h-6 w-6 border-2 border-card">
                          <AvatarFallback className="text-xs bg-secondary">{task.ownerInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            {task.attachments && <div className="flex items-center gap-1 text-sm"><Paperclip className="h-4 w-4" /> {task.attachments}</div>}
                            {task.comments && <div className="flex items-center gap-1 text-sm"><MessageSquare className="h-4 w-4" /> {task.comments}</div>}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
