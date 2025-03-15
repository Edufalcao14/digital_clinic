
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger, 
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
  Settings,
  Activity
} from 'lucide-react';

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-dental-600" />
          <h1 className="font-bold text-lg">ToothTrack Pro</h1>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <Home className="h-5 w-5 mr-2" />
                    <span>Pagina Inicial</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/patients" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span>Pacientes</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/appointments" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Agendamentos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/finance" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Financeiro</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/prescriptions" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    <span>Prescrições</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/reports" 
                    className={({ isActive }) => 
                      isActive ? "text-dental-600 bg-dental-50" : "text-gray-700"
                    }
                  >
                    <PieChart className="h-5 w-5 mr-2" />
                    <span>Relatórios</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
