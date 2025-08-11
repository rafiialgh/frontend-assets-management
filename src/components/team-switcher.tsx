import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: string | React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`
            text-sidebar-primary-foreground
            flex aspect-square size-14 items-center justify-center rounded-lg
            transition-all duration-200
            group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:border
          `}
        >
          {typeof activeTeam.logo === 'string' ? (
            <Link to={'/'}>
              <img
                src={activeTeam.logo}
                alt={activeTeam.name}
                className={`
                object-contain transition-all duration-200
                size-14 group-data-[collapsible=icon]:size-3
              `}
              />
            </Link>
          ) : (
            <activeTeam.logo className='size-4 group-data-[collapsible=icon]:size-3 transition-all duration-200' />
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
