import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { HomeOutlined, CalendarOutlined, UserOutlined, FormOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Header, Content } = Layout;

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: '首页'
        },
        {
            key: '/registration',
            icon: <FormOutlined />,
            label: '报名'
        },
        {
            key: '/schedule',
            icon: <CalendarOutlined />,
            label: '会议日程'
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: '个人中心'
        }
    ];

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <div className={styles.logo}>会议系统</div>
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    className={styles.menu}
                />
            </Header>
            <Content className={styles.content}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default UserLayout; 