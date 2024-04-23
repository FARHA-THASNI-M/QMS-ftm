import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import Login from './login/Login';
import AdminDash from './Admin/AdminDash';
import './index.css';
import CounterDash from './Counter/CounterDash';
import UserForm from './User/UserForm'
import App from './App';

// This component will check if a user is authenticated and has the correct role
const ProtectedRoute = ({ isAuthenticated, role, allowedRoles, redirectTo }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

// Your authentication context or logic to track authentication
const AuthContext = React.createContext();

const AppRouter = () => {
  // This should be based on your authentication state management logic
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  // Set user authentication and role based on login
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/userForm',
      element: <UserForm />,
    },
    {
      path: '/login',
      element: <Login onLogin={handleLogin} />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          role={userRole}
          allowedRoles={['admin']}
          redirectTo="/login"
        />
      ),
      children: [
        {
          path: '',
          element: <AdminDash />,
        },
      ],
    },
    {
      path: '/counter',
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          role={userRole}
          allowedRoles={['counter']}
          redirectTo="/login"
        />
      ),
      children: [
        {
          path: '',
          element: <CounterDash />,
        },
      ],
    },
    {
      path: '/unauthorized',
      element: <div>Unauthorized Access</div>, // A page for unauthorized access
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <AppRouter />
    </NextUIProvider>
  </React.StrictMode>,
);
