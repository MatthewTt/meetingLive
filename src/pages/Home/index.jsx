import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col, Card, List, Image } from 'antd';
import { useNavigate } from 'react-router';
import request from '../../../utils/request';
import styles from './index.module.css';

const Home = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [lives, setLives] = useState([]);
    const [loading, setLoading] = useState(false);

    // 轮播图数据，实际项目中应该从后端获取
    const carouselItems = [
        {
            id: 1,
            imageUrl: 'https://via.placeholder.com/1200x400',
            title: '会议banner 1'
        },
        {
            id: 2,
            imageUrl: 'https://via.placeholder.com/1200x400',
            title: '会议banner 2'
        },
        {
            id: 3,
            imageUrl: 'https://via.placeholder.com/1200x400',
            title: '会议banner 3'
        }
    ];

    // 获取会议列表
    const fetchMeetings = async () => {
        try {
            const response = await request.get('/meetings');
            setMeetings(response.data.list.slice(0, 5)); // 只取前5条
        } catch (error) {
            console.error('获取会议列表失败:', error);
        }
    };

    // 获取直播列表
    const fetchLives = async () => {
        try {
            const response = await request.get('/live-manage');
            setLives(response.data.list.slice(0, 6)); // 只取前6条
        } catch (error) {
            console.error('获取直播列表失败:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchMeetings(), fetchLives()]).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles.container}>
            {/* 轮播图 */}
            <Carousel autoplay className={styles.carousel}>
                {carouselItems.map(item => (
                    <div key={item.id}>
                        <div className={styles.carouselItem}>
                            <img src={item.imageUrl} alt={item.title} />
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* 会议部分 */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>热门会议</h2>
                <Row gutter={24}>
                    <Col span={12}>
                        {meetings[0] && (
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={meetings[0].title}
                                        src={meetings[0].coverUrl || 'https://via.placeholder.com/600x400'}
                                        className={styles.featuredMeetingImage}
                                    />
                                }
                                onClick={() => navigate(`/meeting/${meetings[0].id}`)}
                            >
                                <Card.Meta
                                    title={meetings[0].title}
                                    description={meetings[0].description}
                                />
                            </Card>
                        )}
                    </Col>
                    <Col span={12}>
                        <List
                            className={styles.meetingList}
                            loading={loading}
                            dataSource={meetings.slice(1)}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    onClick={() => navigate(`/meeting/${item.id}`)}
                                    className={styles.meetingListItem}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                                width={120}
                                                height={80}
                                                src={item.coverUrl || 'https://via.placeholder.com/120x80'}
                                                alt={item.title}
                                                preview={false}
                                            />
                                        }
                                        title={item.title}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </div>

            {/* 直播部分 */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>最新直播</h2>
                <Row gutter={[24, 24]}>
                    {lives.map(live => (
                        <Col span={8} key={live.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={live.title}
                                        src={live.coverUrl || 'https://via.placeholder.com/300x200'}
                                        className={styles.liveImage}
                                    />
                                }
                                onClick={() => navigate(`/live/${live.id}`)}
                            >
                                <Card.Meta
                                    title={live.title}
                                    description={live.description}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Home;