import React, { useState, useEffect } from 'react';
import {Carousel, Row, Col, Card, List, Image, Menu} from 'antd';
import {NavLink, useNavigate} from 'react-router';
import request from '../../../utils/request';
import styles from './index.module.css';
import {selectCurrentToken} from "../../../store/slices/userSlice.js";

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
            const response = await request.get('/meeting');
            setMeetings(response.data.slice(0, 5)); // 只取前5条
        } catch (error) {
            console.error('获取会议列表失败:', error);
        }
    };

    // 获取直播列表
    const fetchLives = async () => {
        try {
            const response = await request.get('/live-manage');
            setLives(response.data.slice(0, 6)); // 只取前6条
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
            <div className={styles.menuContainer}>
                <div>左边</div>
                <div>
                    <ul>

                        {
                            !selectCurrentToken && (
                                <li>
                                    <NavLink to='/login'>登录</NavLink>
                                </li>
                            )
                        }

                        {
                            selectCurrentToken && (
                                <>
                                    <li><NavLink to='/me'>个人中心</NavLink></li>
                                    <li><NavLink to='/sign'>报名</NavLink></li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </div>
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
                                        alt={meetings[0].name}
                                        src={meetings[0].cover}
                                        className={styles.featuredMeetingImage}
                                    />
                                }
                                onClick={() => navigate(`/meeting/${meetings[0].id}`)}
                            >
                                <Card.Meta
                                    title={meetings[0].name}
                                    description={meetings[0].guestInfo}
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
                                                src={item.cover}
                                                alt={item.name}
                                                preview={false}
                                            />
                                        }
                                        title={item.name}
                                        description={item.guestInfo}
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
                                        alt={live.meeting.name}
                                        src={live.meeting.cover}
                                        className={styles.liveImage}
                                    />
                                }
                                onClick={() => navigate(`/live/${live.id}`)}
                            >
                                <Card.Meta
                                    style={{ maxHeight: 250}}
                                    title={live.meeting.name}
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