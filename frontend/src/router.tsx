import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import App from './App'
import AdminControls from './pages/AdminControls'

export const router= createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {path:"products", element: <Home/>},
      {path:"admin", element: <AdminControls/>}, 
    ]


  }
])