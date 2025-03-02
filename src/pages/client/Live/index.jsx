import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Avatar, message } from 'antd';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
import request from '../../../utils/request';
import styles from './index.module.css';

const Live = () => {
    const { id } = useParams();
    const [liveInfo, setLiveInfo] = useState(null);
    const [messages, setMessages] = useState([
        {
            content: '欢迎来到直播间！',
            user: {
                name: '系统',
                avatar: 'https://via.placeholder.com/32'
            },
            timestamp: new Date().toISOString()
        },{
            content: '大家好！',
            user: {
                name: '波波',
                avatar: 'https://www.loliapi.com/acg/'
            },
            timestamp: new Date().toISOString()
        },{
            content: '开始直播啦！',
            user: {
                name: '不吃香',
                avatar: 'https://www.loliapi.com/acg/pp'
            },
            timestamp: new Date().toISOString()
        },
    ]);
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

    useEffect(() => {
        if (!liveInfo?.roomId) {
            return;
        }
        socketRef.current = io('http://localhost:3009')

        socketRef.current.on('connect', () => {
            console.log('已连接到服务器');
            socketRef.current.emit('joinRoom', {
                roomId: liveInfo.roomId,
                isBroadcaster: false,
            });

            socketRef.current.on('offer', async (data) => {
                console.log('收到offer', data)
                const {offer, from} = data
                const pc = new RTCPeerConnection()
                peerConnectionRef.current = pc

                pc.onicecandidate = (event) => {
                    socketRef.current.emit('iceCandidate', { candidate: event.candidate, to: from })
                }

                pc.ontrack = (event) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };
                pc.setRemoteDescription(offer)
                const answer = await pc.createAnswer();
                console.log(`创建anser`, answer)
                pc.setLocalDescription(answer)
                socketRef.current.emit('answer', {answer, to: from})
            })

            socketRef.current.on('iceCandidate', (data) => {
                console.log('收到candidate', data)
                const {candidate, from} = data
                peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
                socketRef.current.emit('iceCandidate', { candidate, to: from })
            })

            socketRef.current.on('iceCandidate', (data) => {
                console.log('收到candidate', data)
                const {candidate, from} = data
                peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
            })
        })
    }, [liveInfo?.roomId])
   /* // 初始化WebRTC和Socket.IO连接
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




                // Socket.IO事件处理
                socket.on('connect', () => {
                    console.log('Connected to signaling server');
                });

                socket.on('offer', async (data) => {
                    console.log('收到offer', data)
                    try {
                        await peerConnection.setRemoteDescription(data.offer)
                            .then(() => console.log('setRemoteDescription 成功'))
                            .catch(err => console.error('setRemoteDescription 失败:', err));
                        const answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);
                        socket.emit('answer', { answer, to: data.from });
                        peerConnection.onicecandidate = async (event) => {
                            if (event.candidate) {
                                socket.emit('iceCandidate', { candidate: event.candidate, to: data.from });
                            }
                        };

                        peerConnection.getStats(null).then((stats) => {
                            stats.forEach((report) => {
                                if (report.type === "inbound-rtp" && report.kind === "video") {
                                    console.log("当前视频编码格式:", report.codecId);
                                }
                            });
                        });

                        // 处理远程流
                        peerConnection.ontrack = (event) => {
                            if (videoRef.current) {
                                videoRef.current.srcObject = event.streams[0];
                            }
                        };


                    } catch (error) {
                        console.error('处理offer失败:', error);
                    }
                });

                socket.on('iceCandidate', async (data) => {
                    console.log('[收到 ICE Candidate]:', data);

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
                socket.emit('joinRoom', {
                    roomId: liveInfo.roomId,
                    isBroadcaster: false,
                });
                return () => {
                    socket.disconnect();
                    peerConnection.close();
                };
            } catch (error) {
                console.error('连接初始化失败:', error);
                message.error('直播连接失败，请刷新重试');
            }
        };

        liveInfo?.roomId && initConnection();
    }, [liveInfo?.roomId]);*/
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
                        muted
                    />
                    <div className={styles.description}>
                        {liveInfo?.description}
                    </div>
                </Card>
            </div>

            {/* 右侧聊天区域 */}
            <div className={styles.chatSection}>
                <Card title="实时交流" className={styles.chatCard} styles={{height: 450}}>
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
