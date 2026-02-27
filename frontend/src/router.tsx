import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import AdminControls from './pages/AdminControls'
import Products from './pages/Products'
import { ProtectedRoute } from './ProtectedRoute'


export const router= createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {index: true, element: <Navigate to="/products" replace/>},
      {path:"products", element: <Products/>},
      {path:"admin", element:
        <ProtectedRoute allowedRoles="admin"> 
          <AdminControls/>
        </ProtectedRoute>}, 
    ]


  }
])