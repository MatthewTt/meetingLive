import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import request from '../../../utils/request';
import MeetingForm from './components/MeetingForm';
import styles from './index.module.css';
import dayjs from 'dayjs';

const Guest = () => {
    const [meetings, setMeetings] = useState([
        {
            "guestName": "李明",
            "id": "guest001",
            "guestDesc": "李明是一位资深软件工程师，专注于前端技术和用户体验设计。曾参与多个大型互联网项目的开发。",
            "guestExpertise": "前端开发、UI/UX设计",
            "photo": "https://randomuser.me/api/portraits/men/1.jpg",
            "guestGender": "男"
        },
        {
            "guestName": "张婷",
            "id": "guest002",
            "guestDesc": "张婷博士是人工智能领域的专家，研究方向包括机器学习和自然语言处理。她在全球知名的科研机构工作，拥有多项国际专利。",
            "guestExpertise": "人工智能、机器学习、自然语言处理",
            "photo": "https://randomuser.me/api/portraits/women/2.jpg",
            "guestGender": "女"
        },
        {
            "guestName": "王磊",
            "id": "guest003",
            "guestDesc": "王磊是一个创新创业者，擅长技术与商业的结合，曾创办过几家成功的科技公司。现专注于投资与孵化初创企业。",
            "guestExpertise": "创业、投资、商业策略",
            "photo": "https://randomuser.me/api/portraits/men/3.jpg",
            "guestGender": "男"
        },
        {
            "guestName": "李华",
            "id": "guest004",
            "guestDesc": "李华教授在计算机视觉领域有着丰富的研究经验，特别在深度学习算法的应用方面有很多创新成果。",
            "guestExpertise": "计算机视觉、深度学习、图像识别",
            "photo": "https://randomuser.me/api/portraits/men/4.jpg",
            "guestGender": "男"
        },
        {
            "guestName": "赵丽",
            "id": "guest005",
            "guestDesc": "赵丽是一位心理学专家，专注于情绪管理和行为心理学。她的研究为许多企业的员工培训提供了宝贵的支持。",
            "guestExpertise": "心理学、情绪管理、行为心理学",
            "photo": "https://randomuser.me/api/portraits/women/5.jpg",
            "guestGender": "女"
        },
        {
            "guestName": "孙杰",
            "id": "guest006",
            "guestDesc": "孙杰是全球领先的金融分析师，拥有超过10年的行业经验，专长于市场趋势分析和风险管理。",
            "guestExpertise": "金融分析、市场趋势、风险管理",
            "photo": "https://randomuser.me/api/portraits/men/6.jpg",
            "guestGender": "男"
        },
        {
            "guestName": "周敏",
            "id": "guest007",
            "guestDesc": "周敏女士是一位多次获得国际奖项的著名艺术家，主要创作现代艺术与装置艺术作品。",
            "guestExpertise": "现代艺术、装置艺术",
            "photo": "https://randomuser.me/api/portraits/women/7.jpg",
            "guestGender": "女"
        },
        {
            "guestName": "唐伟",
            "id": "guest008",
            "guestDesc": "唐伟是一位环保科学家，致力于气候变化和可持续发展方面的研究，发表了多篇影响力大的科研文章。",
            "guestExpertise": "环境科学、可持续发展、气候变化",
            "photo": "https://randomuser.me/api/portraits/men/8.jpg",
            "guestGender": "男"
        }
    ]);
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
            title: '嘉宾姓名',
            dataIndex: 'guestName',
            key: 'guestName',
        },
        {
            title: '嘉宾简介',
            dataIndex: 'guestDesc',
            key: 'guestDesc',
        },
        {
            title: '嘉宾擅长领域',
            dataIndex: 'guestExpertise',
            key: 'guestExpertise',
        },
        {
            title: '嘉宾照片',
            dataIndex: 'photo',
            key: 'photo',
            render: (text) => <img src={text} alt="嘉宾照片" style={{ width: '50px', height: '50px' }} />
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
                <h2 className={styles.title}>嘉宾管理</h2>
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
            />
        </div>
    );
};

export default Guest;