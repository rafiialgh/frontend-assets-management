import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  HardDrive,
  Monitor,
  FileCheck,
  Archive
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'alghafary',
    email: 'rafii.alghafari@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Asa Kreasi Interasia',
      logo: '/assets/image/logos/asa-logo.png',
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Master Data',
      url: '/master-data',
      icon: HardDrive,
      items: [
        {
          title: 'Pengguna',
          url: '/user',
        },
        {
          title: 'Lokasi',
          url: '/location',
        },
      ],
    },
    {
      title: 'Pelacakan Aset',
      url: '#',
      icon: Monitor,
      items: [
        {
          title: 'Aset',
          url: '/aset',
        },
        {
          title: 'Perpindahan',
          url: '/perpindahan',
        },
        {
          title: 'Notifikasi',
          url: '/notifikasi',
        },
      ],
    },
    {
      title: 'Maintenance',
      url: '#',
      icon: FileCheck,
    },
    {
      title: 'Kelola Inventaris',
      url: '#',
      icon: Archive,
      items: [
        {
          title: 'Inventaris',
          url: '#',
        },
        {
          title: 'Pengadaan',
          url: '/pengadaan',
        },
        {
          title: 'Pengeluaran',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible='icon' {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  );
}
