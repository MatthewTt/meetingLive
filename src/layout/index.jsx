import React from "react";
import { HomeOutlined, LoginOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { Menu, Breadcrumb } from "antd";
import { Layout } from "antd"
import { Link, Outlet, useMatches } from "react-router";
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
        if (match) {
            const route = matches[matches.length - 1]
            const handle = route?.handle
            setSelectedKeys(route?.pathname)
        }
    }, [matches])

    const menuItems = [
        { name: '首页', path: '/admin/dashboard', icon: <HomeOutlined /> },
        { name: '用户管理', path: '/admin/users', icon: <UserOutlined/> },
        { name: '会议管理', path: '/admin/meeting', icon: <CalendarOutlined /> },
        { name: '直播管理', path: '/admin/liveRoom', icon: <CalendarOutlined /> }
    ]

    const getMenuTitle = (menu) => {
        return (
            <Link to={menu.path}>{menu.name}</Link>
        )
    }

    const treeMenuData = useCallback((menus) => {
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
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default LayoutWrapper