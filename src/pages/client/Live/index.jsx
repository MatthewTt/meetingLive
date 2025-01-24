import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Avatar, message } from 'antd';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
import request from '../../../utils/request';
import styles from './index.module.css';

const Live = () => {
    const { id } = useParams();
    const [liveInfo, setLiveInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const videoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);

    // 获取直播信息
    useEffect(() => {
        const fetchLiveInfo = async () => {
            try {
                const response = await request.get(`/live-manage/${id}`);
                setLiveInfo(response.data);
            } catch (error) {
                message.error('获取直播信息失败');
            }
        };
        fetchLiveInfo();
    }, [id]);

    // 初始化WebRTC和Socket.IO连接
    useEffect(() => {
        const initConnection = async () => {
            try {
                // 创建WebRTC连接
                const configuration = {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ]
                };
                const peerConnection = new RTCPeerConnection(configuration);
                peerConnectionRef.current = peerConnection;

                // 连接Socket.IO
                const socket = io('http://localhost:3009');
                socketRef.current = socket;

                // 处理ICE候选
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('candidate', {
                            candidate: event.candidate
                        });
                    }
                };

                // 处理远程流
                peerConnection.ontrack = (event) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };

                // Socket.IO事件处理
                socket.on('connect', () => {
                    console.log('Connected to signaling server');
                    socket.emit('joinRoom', { roomId: liveInfo?.roomId });
                });

                socket.on('offer', async (data) => {
                    try {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                        const answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);
                        socket.emit('answer', { answer });
                    } catch (error) {
                        console.error('处理offer失败:', error);
                    }
                });

                socket.on('candidate', async (data) => {
                    try {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (error) {
                        console.error('处理candidate失败:', error);
                    }
                });

                socket.on('chat', (data) => {
                    setMessages(prev => [...prev, data]);
                });

                socket.on('error', (error) => {
                    console.error('Socket错误:', error);
                    message.error('连接错误，请刷新重试');
                });

                // 加入直播房间
                socket.emit('join', { liveId: id });

                return () => {
                    socket.disconnect();
                    peerConnection.close();
                };
            } catch (error) {
                console.error('连接初始化失败:', error);
                message.error('直播连接失败，请刷新重试');
            }
        };

        initConnection();
    }, [liveInfo?.roomId]);

    // 发送聊天消息
    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socketRef.current) return;

        const messageData = {
            content: inputMessage,
            user: {
                name: '当前用户', // 这里应该使用实际的用户信息
                avatar: 'https://via.placeholder.com/32'
            },
            timestamp: new Date().toISOString()
        };

        socketRef.current.emit('chat', messageData);
        setInputMessage('');
    };

    return (
        <div className={styles.container}>
            {/* 左侧直播区域 */}
            <div className={styles.videoSection}>
                <Card 
                    title={liveInfo?.title || '直播'}
                    className={styles.videoCard}
                >
                    <video
                        ref={videoRef}
                        className={styles.video}
                        autoPlay
                        playsInline
                        controls
                    />
                    <div className={styles.description}>
                        {liveInfo?.description}
                    </div>
                </Card>
            </div>

            {/* 右侧聊天区域 */}
            <div className={styles.chatSection}>
                <Card title="实时交流" className={styles.chatCard}>
                    <div className={styles.messageList}>
                        <List
                            dataSource={messages}
                            renderItem={item => (
                                <List.Item key={item.timestamp}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.user.avatar} />}
                                        title={item.user.name}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className={styles.inputArea}>
                        <Input.TextArea
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            placeholder="输入消息..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button 
                            type="primary" 
                            onClick={handleSendMessage}
                            className={styles.sendButton}
                        >
                            发送
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Live; 