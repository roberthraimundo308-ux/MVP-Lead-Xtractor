
'use client';

import React, { useState, type DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Plus, Building, Phone, Instagram, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { importLeadsFromString } from '@/ai/flows/import-leads-flow';
import { format } from 'date-fns';

type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  company: string;
  phone: string;
  instagram: string;
  ownerInitials: string;
  comments?: Comment[];
};

const initialBoard: { id: string; title: string; color: string; tasks: Task[] }[] = [
  {
    id: 'novos',
    title: 'Novos',
    color: 'bg-gray-500',
    tasks: []
  },
  {
    id: 'primeiro_contato',
    title: 'Primeiro Contato',
    color: 'bg-orange-500',
    tasks: []
  },
  {
    id: 'oportunidade',
    title: 'Oportunidade',
    color: 'bg-yellow-500',
    tasks: []
  },
  {
    id: 'proposta',
    title: 'Proposta',
    color: 'bg-blue-500',
    tasks: []
  },
  {
    id: 'fechado',
    title: 'Fechado',
    color: 'bg-green-500',
    tasks: []
  },
  {
      id: 'perdido',
      title: 'Perdido',
      color: 'bg-red-500',
      tasks: []
  }
];


export default function HomePage() {
  const [board, setBoard] = useState(initialBoard);
  const { toast } = useToast();
  
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeImportTab, setActiveImportTab] = useState("upload");
  const [fileToImport, setFileToImport] = useState<File | null>(null);
  const [sheetLink, setSheetLink] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const [selectedLead, setSelectedLead] = useState<Task | null>(null);
  const [isLeadSheetOpen, setIsLeadSheetOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    if (sourceColumnId === targetColumnId) return;

    let taskToMove: Task | undefined;
    const newBoard = board.map(column => {
      if (column.id === sourceColumnId) {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          taskToMove = column.tasks[taskIndex];
          return {
            ...column,
            tasks: column.tasks.filter(t => t.id !== taskId)
          };
        }
      }
      return column;
    });

    if (taskToMove) {
      const finalBoard = newBoard.map(column => {
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, taskToMove as Task]
          };
        }
        return column;
      });
      setBoard(finalBoard);
    }
  };

  const handleImportLeads = async () => {
    if (activeImportTab === 'link') {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'A importação por link do Google Sheets será implementada em breve.',
      });
      return;
    }

    if (!fileToImport) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo .csv para importar.',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    
    try {
      toast({ title: 'Iniciando importação...', description: 'Lendo o arquivo selecionado.' });
      const fileContent = await fileToImport.text();
      
      toast({ title: 'Arquivo lido com sucesso!', description: 'Enviando dados para processamento pela IA...' });
      const result = await importLeadsFromString({ spreadsheetData: fileContent });
      
      if (!result || !result.leads) {
        throw new Error('A resposta da IA está em um formato inesperado.');
      }
      
      toast({ title: 'Processamento concluído!', description: 'Adicionando novos leads ao quadro.' });
      const newLeads = result.leads.map((lead) => ({
        ...lead,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }));
        
      if (newLeads.length === 0) {
        toast({
          title: 'Nenhum lead encontrado',
          description: 'O arquivo foi processado, mas não foram encontrados leads para importar.',
        });
      } else {
          const novosColumn = board.find(c => c.id === 'novos');
          const existingTitles = new Set(novosColumn?.tasks.map(t => t.title) || []);
          const uniqueNewLeads = newLeads.filter(lead => !existingTitles.has(lead.title));

          if (uniqueNewLeads.length > 0) {
              setBoard(currentBoard => {
                  return currentBoard.map(column => {
                      if (column.id === 'novos') {
                          return {
                              ...column,
                              tasks: [...column.tasks, ...uniqueNewLeads]
                          };
                      }
                      return column;
                  });
              });
              toast({
                  title: 'Leads importados com sucesso!',
                  description: `${uniqueNewLeads.length} novos leads foram adicionados à coluna "Novos".`,
              });
          } else {
              toast({
                  title: 'Nenhum lead novo adicionado',
                  description: 'Todos os leads do arquivo já existem no seu quadro.',
              });
          }
      }

      setIsImportDialogOpen(false);
      setFileToImport(null);

    } catch (error) {
      console.error('Detailed import error:', error);
      let errorMessage = 'Ocorreu um erro desconhecido ao processar o arquivo.';
      if (error instanceof Error) {
          errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = String((error as {message: string}).message);
      }
      
      if (errorMessage.includes('API key not valid')) {
          errorMessage = 'A chave de API do Gemini não é válida ou não foi configurada. Vá para a página de Configurações para obter instruções sobre como configurá-la no seu ambiente Vercel.';
      } else if (errorMessage.includes('location is not supported')) {
          errorMessage = 'A região do seu servidor Vercel pode não ser suportada pela API. Verifique as configurações da sua conta Google AI e as configurações de região da sua aplicação na Vercel.';
      } else if (errorMessage.includes("Content is blocked")) {
          errorMessage = "O conteúdo do arquivo foi bloqueado pelos filtros de segurança. Verifique o arquivo e tente novamente."
      } else if (errorMessage.includes('Failed to fetch')) {
          errorMessage = "Falha na comunicação com o servidor. Verifique sua conexão com a internet e os logs da aplicação na Vercel.";
      }


      toast({
        title: 'Erro ao importar leads',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleCardClick = (task: Task) => {
    setSelectedLead(task);
    setEditingLead({ ...task });
    setIsLeadSheetOpen(true);
  };

  const handleLeadUpdate = () => {
    if (!editingLead) return;
    const newBoard = board.map(column => ({
        ...column,
        tasks: column.tasks.map(task => task.id === editingLead.id ? editingLead : task)
    }));
    setBoard(newBoard);
    setIsLeadSheetOpen(false);
    toast({ title: "Lead atualizado com sucesso!" });
  };

  const handleAddComment = () => {
      if (!newComment.trim() || !editingLead) return;
      const comment: Comment = {
          id: `comment-${Date.now()}`,
          text: newComment,
          author: 'Usuário',
          timestamp: new Date().toISOString(),
      };
      const updatedLead: Task = {
          ...editingLead,
          comments: [comment, ...(editingLead.comments || [])]
      };
      setEditingLead(updatedLead);
      
      const newBoard = board.map(column => ({
          ...column,
          tasks: column.tasks.map(task => task.id === updatedLead.id ? updatedLead : task)
      }));
      setBoard(newBoard);
      setNewComment('');
      toast({ title: "Comentário adicionado." });
  };


  return (
    <div className="bg-muted/40 h-full">
      <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        <header className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM Leads</h1>
            <p className="text-muted-foreground">Gerencie seus leads no pipeline de vendas.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Leads
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Importar Leads de Planilha</DialogTitle>
                  <DialogDescription>
                    Faça upload de um arquivo ou cole o link da sua planilha do Google Sheets para importar seus leads.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Tabs defaultValue="upload" onValueChange={setActiveImportTab} value={activeImportTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Fazer Upload
                      </TabsTrigger>
                      <TabsTrigger value="link">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Link do Sheets
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-6">
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="file-upload">Selecione o arquivo</Label>
                        <Input id="file-upload" type="file" onChange={(e) => setFileToImport(e.target.files?.[0] || null)} accept=".csv" />
                        <p className="text-xs text-muted-foreground">Formatos suportados: .csv</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="link" className="pt-6">
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="sheet-link">Link da planilha do Google</Label>
                        <Input id="sheet-link" placeholder="https://docs.google.com/spreadsheets/d/..." value={sheetLink} onChange={(e) => setSheetLink(e.target.value)} />
                        <p className="text-xs text-muted-foreground">Sua planilha deve estar com acesso público.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button type="button" className="w-full" onClick={handleImportLeads} disabled={isImporting}>
                    {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isImporting ? 'Importando...' : 'Importar Leads'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
          </div>
        </header>

        <div className="flex-grow overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 pb-4 h-full">
            {board.map((column) => (
              <div 
                key={column.id} 
                className="w-80 flex-shrink-0 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
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
                <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                      onClick={() => handleCardClick(task)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <Card className="bg-card hover:shadow-md transition-shadow">
                        <CardHeader className="p-3 pb-1">
                          <h3 className="font-semibold text-card-foreground leading-tight pr-2">{task.title}</h3>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          <div className="text-sm text-muted-foreground space-y-2">
                              <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 shrink-0 text-gray-500" />
                                  <span>{task.company}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 shrink-0 text-gray-500" />
                                  <span>{task.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Instagram className="h-4 w-4 shrink-0 text-gray-500" />
                                  <span>{task.instagram}</span>
                              </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-2">
                          <Button asChild variant="outline" size="sm" className="w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800">
                              <a href={`https://wa.me/${task.phone.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current"><path d="M16.75 13.96c-.25-.13-1.48-.73-1.71-.81-.23-.08-.39-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.01-.38.12-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.35-.76-1.84c-.2-.48-.41-.42-.56-.42-.14,0-.3,0-.47,0-.17,0-.43.06-.66.31-.22.25-.86.84-.86,2.05,0,1.21.88,2.37,1,2.54.12.17,1.7,2.59,4.1,3.63.59.26,1.05.41,1.41.52.59.19,1.13.16,1.56.1.48-.07,1.48-.6,1.69-1.18.21-.58.21-1.07.15-1.18-.07-.1-.22-.16-.47-.29zM12.05 2.04c-5.46 0-9.9,4.44-9.9,9.9 0,5.46,4.44,9.9,9.9,9.9,5.46,0,9.9-4.44,9.9-9.9 0-5.46-4.44-9.9-9.9-9.9zM12.05 20.3c-4.55,0-8.25-3.7-8.25-8.25s3.7-8.25,8.25-8.25,8.25,3.7,8.25,8.25-3.7,8.25-8.25,8.25z"></path></svg>
                                  WhatsApp
                              </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Sheet open={isLeadSheetOpen} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedLead(null);
                setEditingLead(null);
            }
            setIsLeadSheetOpen(isOpen);
        }}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                {editingLead && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Editar Lead</SheetTitle>
                            <SheetDescription>Altere as informações e adicione comentários. Clique em salvar quando terminar.</SheetDescription>
                        </SheetHeader>
                        <div className="py-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="lead-name">Nome</Label>
                                    <Input id="lead-name" value={editingLead.title} onChange={(e) => setEditingLead({...editingLead, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lead-company">Empresa</Label>
                                    <Input id="lead-company" value={editingLead.company} onChange={(e) => setEditingLead({...editingLead, company: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lead-description">Descrição (Valor)</Label>
                                <Input id="lead-description" value={editingLead.description} onChange={(e) => setEditingLead({...editingLead, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lead-phone">Telefone</Label>
                                    <Input id="lead-phone" value={editingLead.phone} onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lead-instagram">Instagram</Label>
                                    <Input id="lead-instagram" value={editingLead.instagram} onChange={(e) => setEditingLead({...editingLead, instagram: e.target.value})} />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="font-medium mb-4 text-lg">Comentários</h4>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-comment">Adicionar comentário</Label>
                                        <Textarea id="new-comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escreva uma atualização ou nota..." />
                                        <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">Adicionar</Button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h5 className="font-medium text-base">Histórico</h5>
                                        {editingLead.comments && editingLead.comments.length > 0 ? (
                                            editingLead.comments.map(comment => (
                                                <div key={comment.id} className="bg-muted/50 p-3 rounded-lg border">
                                                    <p className="text-sm">{comment.text}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">{comment.author} - {format(new Date(comment.timestamp), "dd/MM/yyyy 'às' HH:mm")}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SheetFooter>
                            <Button variant="outline" onClick={() => setIsLeadSheetOpen(false)}>Cancelar</Button>
                            <Button onClick={handleLeadUpdate}>Salvar Alterações</Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
