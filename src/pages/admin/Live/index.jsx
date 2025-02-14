import React, { useState, useEffect } from 'react';
import {Table, Button, Space, message, Popconfirm, Tooltip} from 'antd';
import request from '../../../utils/request';
import LiveForm from './components/LiveForm';
import styles from './index.module.css';
import dayjs from 'dayjs';
import {CopyOutlined} from "@ant-design/icons";

const Live = () => {
    const [lives, setLives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLive, setCurrentLive] = useState(null);

    // 获取直播列表
    const fetchLives = async () => {
        setLoading(true);
        try {
            const response = await request.get('/live-manage');
            setLives(response.data);
        } catch (error) {
            console.error('获取直播列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLives();
    }, []);

    // 删除直播
    const handleDelete = async (id) => {
        try {
            await request.delete(`/live-manage/${id}`);
            message.success('删除直播成功');
            fetchLives();
        } catch (error) {
            console.error('删除失败:', error);
        }
    };

    // 编辑直播
    const handleEdit = (record) => {
        setCurrentLive(record);
        setModalVisible(true);
    };

    // 添加新直播
    const handleAdd = () => {
        setCurrentLive(null);
        setModalVisible(true);
    };

    const columns = [
        {
            title: '直播ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: '预计开始时间',
            dataIndex: 'plannedStartTime',
            key: 'plannedStartTime',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
        },
        {
            title: '实际开始时间',
            dataIndex: 'actualStartTime',
            key: 'actualStartTime',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
        },
        {
            title: '主播URL',
            dataIndex: 'broadcasterToken',
            key: 'broadcasterToken',
            render: (text, record) => {
                return <Tooltip title={`${window.location.origin}/live/${record.id}/${text}`}>
                    <CopyOutlined onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/live/${record.id}/${text}`);
                    }} />
                </Tooltip>
            }
        },
        {
            title: '主播URL',
            dataIndex: 'liveUrl'
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
                        title="确定要删除这个直播吗？"
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
                <h2 className={styles.title}>直播管理</h2>
                <Button type="primary" onClick={handleAdd}>
                    添加直播
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={lives}
                    rowKey="id"
                    loading={loading}
                />
            </div>

            <LiveForm
                visible={modalVisible}
                initialValues={currentLive}
                onCancel={() => {
                    setModalVisible(false);
                    setCurrentLive(null);
                }}
                onSuccess={fetchLives}
            />
        </div>
    );
};

export default Live; 