import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import request from '../../../utils/request';
import MeetingForm from './components/MeetingForm';
import styles from './index.module.css';
import dayjs from 'dayjs';

const Meeting = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMeeting, setCurrentMeeting] = useState(null);

    // 获取会议列表
    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const response = await request.get('/meeting');
            setMeetings(response.data);
        } catch (error) {
            console.error('获取会议列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    // 删除会议
    const handleDelete = async (id) => {
        try {
            await request.delete(`/meeting/${id}`);
            message.success('删除会议成功');
            fetchMeetings();
        } catch (error) {
            console.error('删除失败:', error);
        }
    };

    // 编辑会议
    const handleEdit = (record) => {
        setCurrentMeeting(record);
        setModalVisible(true);
    };

    // 添加新会议
    const handleAdd = () => {
        setCurrentMeeting(null);
        setModalVisible(true);
    };

    const columns = [
        {
            title: '会议ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '会议名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '会议时间',
            dataIndex: 'meetingTime',
            key: 'meetingTime',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
        },
        {
            title: '会议地点',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '嘉宾介绍',
            dataIndex: 'guestInfo',
            key: 'guestInfo',
            ellipsis: true
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
                        title="确定要删除这个会议吗？"
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
                <h2 className={styles.title}>会议管理</h2>
                <Button type="primary" onClick={handleAdd}>
                    添加会议
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={meetings}
                    rowKey="id"
                    loading={loading}
                />
            </div>

            <MeetingForm
                visible={modalVisible}
                initialValues={currentMeeting}
                onCancel={() => {
                    setModalVisible(false);
                    setCurrentMeeting(null);
                }}
                onSuccess={fetchMeetings}
            />
        </div>
    );
};

export default Meeting; 