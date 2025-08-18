import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Link, Outlet, useLocation, useMatches } from 'react-router-dom';
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

type CrumbMatch = {
  pathname: string;
  handle: {
    breadcrumb: string;
  };
};


export default function RootLayout() {
  const matches = useMatches() as CrumbMatch[];
  const crumbs = matches.filter((m) => m.handle?.breadcrumb);
  return (
    <SidebarProvider>
      <div className='flex h-screen w-screen overflow-hidden'>
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className='flex flex-col flex-1'>
          {/* Header */}
          <header className='flex items-center gap-2 px-4 h-14 border-b'>
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;

                  return (
                    <React.Fragment key={crumb.pathname}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {crumb.handle.breadcrumb}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <p>
                              {crumb.handle.breadcrumb}
                            </p>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>

                      {/* Separator hanya muncul jika bukan item terakhir */}
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Page content */}
          <main className='flex-1 p-5 overflow-auto bg-zinc-200/60'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
