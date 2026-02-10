import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Building, Globe, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buscar Empresas | VezaLeads',
    description: 'Encontre novas empresas e oportunidades.',
};

const searchResults = [
    { name: 'InovaTech Soluções', industry: 'Tecnologia', location: 'São Paulo, SP', employees: '50-100', website: 'inovatech.com', phone: '(11) 98765-4321' },
    { name: 'ConstruForte Engenharia', industry: 'Construção', location: 'Rio de Janeiro, RJ', employees: '200-500', website: 'construforte.com.br', phone: '(21) 12345-6789' },
    { name: 'AgroVital S.A.', industry: 'Agronegócio', location: 'Cuiabá, MT', employees: '1000+', website: 'agrovital.com', phone: '(65) 55555-4444' },
    { name: 'Saúde & Bem-Estar Clínica', industry: 'Saúde', location: 'Belo Horizonte, MG', employees: '20-50', website: 'saudebemestar.med.br', phone: '(31) 99999-8888' },
];

export default function SearchPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Buscar Empresas</h1>
        <p className="text-muted-foreground">Encontre novas oportunidades de negócio.</p>
      </header>

      <div className="max-w-2xl mb-8">
        <form className="flex items-center gap-2">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="search" placeholder="Buscar por nome, CNPJ, setor..." className="pl-10" />
            </div>
          <Button type="submit">Buscar</Button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Resultados da busca</h2>
        <div className="space-y-4">
            {searchResults.map((company, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{company.name}</CardTitle>
                                <CardDescription>{company.industry}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Adicionar aos Leads</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Localização: </span>
                            <span className="font-medium">{company.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-muted-foreground">Funcionários: </span>
                            <span className="font-medium">{company.employees}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a href={`http://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{company.phone}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
