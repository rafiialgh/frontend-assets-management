// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth'; // hook untuk ambil role user

// export default function ProtectedRoute({ element, roles }: { element: JSX.Element; roles: string[] }) {
//   const { user } = useAuth(); // misalnya { role: 'maintenance' }
//   const location = useLocation();

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return element;
// }
