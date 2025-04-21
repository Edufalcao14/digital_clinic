import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  PieChart,
} from 'lucide-react';

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-slate-200 bg-gradient-to-b from-rose-50 to-white">
      <SidebarHeader className="flex flex-col items-center justify-center py-6 space-y-2">
        <div className="rounded-full">
          <img src="/images/logo-light.png" alt="logo" className="w-20 h-20" />
        </div>
        <h1 className="text-lg font-medium tracking-wide text-slate-800">
          Dra. Jéssica De Carvalho
        </h1>
        <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500 ml-2">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <Home className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Página Inicial</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/patients" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <Users className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Pacientes</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/appointments" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <Calendar className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Agendamentos</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/finance" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <DollarSign className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Financeiro</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/prescriptions" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <FileText className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Prescrições</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/reports" className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-rose-300 to-purple-300 text-white shadow-md"
                          : "hover:bg-rose-100 text-slate-700"
                        }`}
                    >
                      <PieChart className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-rose-400"}`} />
                      <span>Relatórios</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto py-6 flex justify-center">
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-100 to-purple-100 text-xs text-center text-slate-600">
            <p>Clínica Digital</p>
            <p className="font-medium text-rose-500">v1.2.0</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;