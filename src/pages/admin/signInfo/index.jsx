import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import request from '../../../utils/request';
import styles from './index.module.css';
const SignInfo = () => {
    const [meetings, setMeetings] = useState([
            {
                "name": "王晓明",
                "age": 28,
                "idCard": "110101199301017517",
                "phone": "13812345678",
                "gender": "男",
                "conference": "2025年度前端开发大会",
                "status": "审核通过"
            },
            {
                "name": "李丽",
                "age": 35,
                "idCard": "320501198701029834",
                "phone": "13987654321",
                "gender": "女",
                "conference": "2025年度人工智能论坛",
                "status": "待审核"
            },
            {
                "name": "张磊",
                "age": 40,
                "idCard": "440102198512123456",
                "phone": "13887654321",
                "gender": "男",
                "conference": "2025年度创业创新峰会",
                "status": "审核不通过"
            },
            {
                "name": "赵媛媛",
                "age": 27,
                "idCard": "110101199604011234",
                "phone": "13765432109",
                "gender": "女",
                "conference": "2025年度区块链技术大会",
                "status": "审核通过"
            },
            {
                "name": "刘俊",
                "age": 32,
                "idCard": "510107198902283492",
                "phone": "13576543210",
                "gender": "男",
                "conference": "2025年度大数据技术论坛",
                "status": "待审核"
            },
            {
                "name": "孙倩",
                "age": 25,
                "idCard": "340506199808230876",
                "phone": "13712349876",
                "gender": "女",
                "conference": "2025年度前端开发大会",
                "status": "审核通过"
            },
            {
                "name": "周涛",
                "age": 45,
                "idCard": "130202197801092021",
                "phone": "13912340987",
                "gender": "男",
                "conference": "2025年度技术架构大会",
                "status": "审核不通过"
            },
            {
                "name": "何琪",
                "age": 30,
                "idCard": "330102199305112389",
                "phone": "13898765432",
                "gender": "女",
                "conference": "2025年度人工智能论坛",
                "status": "待审核"
            }
        ]
    );
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMeeting, setCurrentMeeting] = useState(null);



    // 删除会议
    const handleDelete = async (id) => {
        try {
            await request.delete(`/meeting/${id}`);
            message.success('删除会议成功');
            // fetchMeetings();
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
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '身份证',
            dataIndex: 'idCard',
            key: 'idCard',
        },
        {
            title: '报名会议',
            dataIndex: 'conference',
            key: 'conference',
        },

        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
        },

        {
            title: '审核状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => {
                if (record.status === '待审核') {
                    return <Space size="middle">

                        <Button type="link" onClick={() => handleEdit(record)}>
                            审核拒绝
                        </Button>
                        <Button type="link" onClick={() => handleEdit(record)}>
                            审核通过
                        </Button>
                    </Space>
                } else {
                    return null
                }

            }
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>报名管理</h2>

            </div>

            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={meetings}
                    rowKey="id"
                    loading={loading}
                />
            </div>

        </div>
    );
};

export default SignInfo;