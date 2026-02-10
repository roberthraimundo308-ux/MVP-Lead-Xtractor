'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: '/', label: 'CRM Leads', icon: LayoutGrid },
  { href: '/search', label: 'Buscar Empresas', icon: Search },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

function NavItem({ href, label, icon: Icon, isActive }: { href: string, label: string, icon: React.ElementType, isActive: boolean }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition justify-center md:justify-start',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="hidden md:block">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="block md:hidden">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 py-6 px-3 space-y-1">
      {navItems.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return <NavItem key={item.href} {...item} icon={item.icon} isActive={isActive} />;
      })}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="w-16 md:w-64 bg-card border-r border-border flex flex-col shrink-0 z-20">
        <div className="h-16 flex items-center px-4 md:px-6 border-b border-border justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2 text-primary">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shrink-0">V</div>
                <span className="text-xl font-bold tracking-tight text-foreground hidden md:block">VEZA</span>
            </Link>
        </div>
      <SidebarNav />
      <div className="p-4 border-t border-border hidden md:block">
        <div className="bg-secondary p-3 rounded-xl flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">EU</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-foreground">Usuário</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
