import type { RouteObject } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RootLayout from '@/components/RootLayout';
import Dashboard from '@/pages/Dashboard';
import UserPage from '@/pages/MasterData/User';
import LocationPage from '@/pages/MasterData/Location';
import EmptyLayout from '@/components/EmptyLayout';
import { getAllUser } from '@/services/auth/auth.service';
import Aset from '@/pages/Pelacakan Aset/Aset';
import Perpindahan from '@/pages/Pelacakan Aset/Perpindahan';
import Notifikasi from '@/pages/Pelacakan Aset/Notifikasi';

const globalRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: '/',
        element: <EmptyLayout />,
        handle: { breadcrumb: 'Master Data' },
        children: [
          {
            path: 'user',
            // loader: async () => {
            //   const users = await getAllUser();

            //   return {
            //     data: users.data, // array user
            //     summary: users.summary, // ringkasan
            //     pagination: users.pagination, // opsional kalau mau
            //   };
            // },
            element: <UserPage />,
            handle: { breadcrumb: 'Users' },
          },
          {
            path: 'location',
            element: <LocationPage />,
            handle: { breadcrumb: 'Locations' },
          },
        ],
      },
      {
        path: '/',
        element: <EmptyLayout />,
        handle: { breadcrumb: 'Pelacakan Aset' },
        children: [
          {
            path: 'aset',
            element: <Aset />,
            handle: { breadcrumb: 'Aset' }
          },
          {
            path: 'perpindahan',
            element: <Perpindahan />,
            handle: { breadcrumb: 'Perpindahan' }
          },
          {
            path: 'notifikasi',
            element: <Notifikasi />,
            handle: { breadcrumb: 'Notifikasi' }
          },
        ]
      }
    ],
  },
];

export default globalRoutes;
