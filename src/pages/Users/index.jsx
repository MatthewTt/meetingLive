import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import request from '../../utils/request';
import UserForm from './components/UserForm';
import styles from './index.module.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // 获取用户列表
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await request.get('/users');
            setUsers(response.data.list);
        } catch (error) {
            console.error('获取用户列表失败:', error);
            message.error('获取用户列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 删除用户
    const handleDelete = async (id) => {
        try {
            await request.delete(`/users/${id}`);
            message.success('删除用户成功');
            fetchUsers();
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除用户失败');
        }
    };

    // 编辑用户
    const handleEdit = (record) => {
        setCurrentUser(record);
        setModalVisible(true);
    };

    // 添加用户
    const handleAdd = () => {
        setCurrentUser(null);
        setModalVisible(true);
    };

    const columns = [
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '账号',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '账号类型',
            dataIndex: 'type',
            key: 'type',
            render: (type) => type === 1 ? '管理员' : '普通用户'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个用户吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>用户管理</h2>
                <Button type="primary" onClick={handleAdd}>
                    添加用户
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                />
            </div>

            <UserForm
                visible={modalVisible}
                initialValues={currentUser}
                onCancel={() => {
                    setModalVisible(false);
                    setCurrentUser(null);
                }}
                onSuccess={fetchUsers}
            />
        </div>
    );
};

export default Users; 