import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { router } from "./router";
import { RouterProvider } from 'react-router-dom'
import AuthInitializer from './components/AuthInitializer'
import FavoritesProvider from './components/FavoritesProvider'


createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <FavoritesProvider>
        <RouterProvider router={router} />
        </FavoritesProvider>
      </AuthInitializer>
    </Provider>
  //</StrictMode>,
)
