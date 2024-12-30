
import LayoutWrapper from './layout/index.jsx'
import { router } from './router/index.jsx'
import Routers from './Routers.jsx'
import { BrowserRouter, RouterProvider } from 'react-router'

function App() {

  return (
    <>
      <RouterProvider router={router} />
      
    </>
  )
}

export default App
