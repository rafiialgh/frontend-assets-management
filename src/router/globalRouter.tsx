import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RootLayout from "@/components/RootLayout";
import Dashboard from "@/pages/Dashboard";
import UserPage from "@/pages/MasterData/User";
import LocationPage from "@/pages/MasterData/Location";

const globalRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  }, 
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/user',
        element: <UserPage />
      },
      {
        path: '/location',
        element: <LocationPage />
      }
    ]
  }
]

export default globalRoutes