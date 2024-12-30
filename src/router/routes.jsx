
import { Navigate } from "react-router";
import LayoutWrapper from "../layout";
import Home from "../pages/Home";
import Login from "../pages/Login";

export const routes = [
    {
        path: '/',
        element: <LayoutWrapper />,
        children: [
            {
                path: '/',
                // 重定向
                element: <Navigate to="/home" />
            },
            {
                path: '/home',
                element: <Home/>
            },
            
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]