import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import App from './App'
import AdminControls from './pages/AdminControls'
import { Provider } from 'react-redux'
import { store } from './store/store'

const router= createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children: [
      {path:"", element: <Home/>},
      {path:"", element: <AdminControls/>}, 
    ]


  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
