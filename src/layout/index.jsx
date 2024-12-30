
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";
import { Menu, Breadcrumb } from "antd";
import { Layout } from "antd"
import { BrowserRouter, Link, Outlet, useMatch, useMatches } from "react-router";
import Routers from "../Routers.jsx";
import { useCallback } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
const { Header, Content, Footer, Sider } = Layout;
const LayoutWrapper = () => {
    const [selectedKeys, setSelectedKeys] = useState([])
    const matches = useMatches()

    useEffect(() => {
        const [match] = matches || []
        console.log(matches, 'matches')
        if (match) {
            // 匹配当前路由
            const route = matches[matches.length - 1]
        
            const handle = route?.handle
            console.log(handle, 'handle');
            
            // 菜单高亮
            setSelectedKeys(route?.pathname)

        }
        console.log(match, 'match')
    }, [matches])
    const menuItems = [
        { name: '首页', path: '/home', icon: <HomeOutlined /> },
        { name: '登录', path: '/login', icon: <LoginOutlined /> }
    ]

    const getMenuTitle = (menu) => {
        return (
            <Link to={menu.path}>{menu.name}</Link>
        )

    }

    const treeMenuData = useCallback((menus) => {
        console.log(menus);
        
        return menus.map((menu) => {
            return {
                key: menu.path,
                icon: menu.icon,
                label: getMenuTitle(menu),
                children: menu.children && treeMenuData(menu.children)
            }
        })
    }, [])

    const menuData = useMemo(() => {
        return treeMenuData(menuItems)
    }, [])

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <Menu theme="dark" items={menuData} selectedKeys={selectedKeys}></Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default LayoutWrapper