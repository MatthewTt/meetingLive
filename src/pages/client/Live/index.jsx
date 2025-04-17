import React, {useState, useEffect, useRef} from 'react';
import {Card, Input, Button, List, Avatar, message} from 'antd';
import {useParams} from 'react-router';
import {io} from 'socket.io-client';
import request from '../../../utils/request';
import styles from './index.module.css';
import store from "../../../store/index.js";

const Live = () => {
    const {id} = useParams();
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
                console.log(response, 'res')

            } catch (error) {
                message.error('获取直播信息失败');
            }
        };

        fetchLiveInfo();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [id]);

    useEffect(() => {
        if (liveInfo) {
            handleConnect();
        }
    }, [liveInfo?.roomId])

    const handleConnect = () => {
        console.log('连接')
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3009', {
                extraHeaders: {
                    'Authorization': `Bearer ${store.getState().user.token}`
                }
            })
        }

        socketRef.current.on('connect', () => {
            console.log('已连接到服务器');

            socketRef.current.emit('joinRoom', {
                roomId: liveInfo?.roomId,
                isBroadcaster: false,
            });
        })

        socketRef.current.on('offer', async (data) => {
            console.log('收到offer', data)
            const {offer, from} = data
            const pc = new RTCPeerConnection()
            peerConnectionRef.current = pc

            pc.onicecandidate = (event) => {
                socketRef.current.emit('iceCandidate', {candidate: event.candidate, to: from})
            }

            pc.ontrack = (event) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                }
            };
            await pc.setRemoteDescription(offer)
            const answer = await pc.createAnswer();
            console.log(`创建anser`, answer)
            await pc.setLocalDescription(answer)
            socketRef.current.emit('answer', {answer, to: from})
        })

        socketRef.current.on('iceCandidate', (data) => {
            console.log('收到candidate', data)
            const {candidate, from} = data;
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
            // socketRef.current.emit('iceCandidate', {candidate, to: from})
        })

        socketRef.current.on('message', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        })

    }

    // 发送聊天消息
    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socketRef.current) return;

        const messageData = {
            message: inputMessage,
            roomId: liveInfo?.roomId,
        };

        socketRef.current.emit('message', messageData);
        setInputMessage('');
    };

    const closeLive = () => {
        // 手动掉线
        socketRef.current.close()
    }
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
                                        avatar={<Avatar src={item.user.avatar}/>}
                                        title={item.user.name}
                                        description={item.message}
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
                            autoSize={{minRows: 2, maxRows: 4}}
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

            <Button type="primary" onClick={closeLive}>关闭直播</Button>
        </div>
    );
};

export default Live;
