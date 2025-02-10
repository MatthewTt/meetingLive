import { Navigate } from "react-router";
import LayoutWrapper from "../layout";
import Dashboard from "../pages/admin/Home";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Meeting from "../pages/admin/Meeting";
import Live from "../pages/admin/Live";
import ClientHome from "../pages/client/Home";
import LiveDetail from "../pages/client/Live";
import {Outlet} from "react-router";
import Me from "../pages/client/Me/index.jsx";
export const routes = [
    {
        path: '/admin',
        element: <LayoutWrapper />,
        children: [
            {
                path: '',
                element: <Navigate to="dashboard" />
            },
            {
                path: 'dashboard',
                element: <Dashboard/>
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'meeting',
                element: <Meeting />
            },
            {
                path: 'liveRoom',
                element: <Live />
            }
        ]
    },
    {
        path: '/',
        element: <div><Outlet /></div>,
        children: [
            {
                path: '',
                element: <Navigate to="home" />
            },
            {
                path: 'home',
                element: <ClientHome/>
            },
            {
                path: 'live/:id',
                element: <LiveDetail />
            },
            {
                path: 'me',
                element: <Me />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]