import {useEffect, useRef, useState} from "react";
import {io} from 'socket.io-client';
import request from "../../../utils/request.js";
import {message} from "antd";
import {useParams} from "react-router";
import store from "../../../store/index.js";

const Zhubo = () => {
    const [isCapturing, setIsCapturing] = useState(false); // 控制屏幕捕获状态
    const videoRef = useRef(null); // 本地视频流的 ref
    const mediaStreamRef = useRef(null); // 存储媒体流对象
    const RTC = useRef();
    const heartbeatTimer = useRef();
    const [liveInfo, setLiveInfo] = useState(null);
    const [onlineCount, setOnlineCount] = useState(0)

    //socket.io实例
    let socketInstance = useRef();
    const {id, token} = useParams();

    useEffect(() => {
        fetchLiveInfo()
    }, [])

    useEffect(() => {
        if (liveInfo?.roomId) {
            handleConnectIo()
        }
    }, [liveInfo?.roomId])
    const fetchLiveInfo = async () => {
        try {
            const response = await request.get(`/live-manage/${id}`);
            setLiveInfo(response.data);
        } catch (error) {
            message.error('获取直播信息失败');
        }
    };

    const handleGetLocalStream = (cb) => {
        // 共享屏幕

        navigator.mediaDevices.getDisplayMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
            video: true,
        }).then((stream) => {
            mediaStreamRef.current = stream;
            if (mediaStreamRef.current) {
                videoRef.current.srcObject = mediaStreamRef.current;
            }

            cb()
        })
    }

    const handleConnectIo = () => {
        const socket = io('http://localhost:3009', {
            extraHeaders: {
                'Authorization': `Bearer ${store.getState().user.token}`
            }
        });
        socketInstance.current = socket;
        socket.on('connect', () => {
            console.log('已连接到服务器');
            // startHeartbeat()
            socket.emit('joinRoom', {
                roomId: liveInfo?.roomId,
                isBroadcaster: true,
                broadcasterToken: token
            })
        });

        socket.on('disconnect', () => {
            console.log('断开连接')
        })

        socket.on('connect_error', () => {
            console.log('连接错误')
        })

        socket.on('userJoined', async({socketId, onlineCount}) => {
            console.log('用户加入', socketId, onlineCount)
            setOnlineCount(onlineCount)

            const pc = new RTCPeerConnection()
            RTC.current = pc
            mediaStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, mediaStreamRef.current)
            })
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer)

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('iceCandidate', {
                        candidate: event.candidate,
                        to: socketId
                    })
                }
            }
            socket.emit('offer', { offer, to: socketId })
        })

        socket.on('answer', (data) => {
            console.log('收到answer', data)
            const {answer} = data

            if (RTC.current?.signalingState !== "have-local-offer") {
                console.warn("收到 answer 但状态不对，忽略", RTC.current?.signalingState);
                return;
            }
            RTC.current.setRemoteDescription(new RTCSessionDescription(answer))
        })


        socket.on('iceCandidate', (data) => {
            console.log('收到iceCandidate', data)
            if (data.candidate) {
                RTC.current.addIceCandidate(new RTCIceCandidate(data.candidate))
            }
        })
    }

    // 开始直播，打开媒体设备然后建立socket连接
    const startLive = () => {
        handleGetLocalStream(() => {
            setIsCapturing(true)
        })
    }

    const stopLive = () => {
        setIsCapturing(false)
        mediaStreamRef.current.getTracks().forEach(track => {
            track.stop()
        })

    }


    return (
        <div className="screen-capture-container">
            <h4>人数：{onlineCount}</h4>
            {/* 显示捕获的视频流 */}
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="100%"
                    height="70%"
                    style={{objectFit: 'cover'}}
                />
            </div>

            {/* 控制按钮 */}
            <div className="controls">
                {!isCapturing ? (
                    <button onClick={startLive} className="start-capture-btn">
                        开始直播
                    </button>
                ) : (
                    <div  className="stop-capture-btn" onClick={stopLive}>
                        结束直播
                    </div>
                )}
            </div>
        </div>
    );
};

export default Zhubo;
