import {useEffect, useRef, useState} from "react";
import {io} from 'socket.io-client';
import request from "../../../utils/request.js";
import {message} from "antd";
import {useParams} from "react-router";

const Zhubo = () => {
    const [isCapturing, setIsCapturing] = useState(false); // 控制屏幕捕获状态
    const videoRef = useRef(null); // 本地视频流的 ref
    const mediaStreamRef = useRef(null); // 存储媒体流对象
    const [liveInfo, setLiveInfo] = useState(null);
    const [userList, setUserList] = useState([])

    //socket.io实例
    let socketInstance = useRef();
    const {id, token} = useParams();

    useEffect(() => {
        fetchLiveInfo()
    }, [])
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
            audio: true,
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
        const socket = io('http://localhost:3009');
        socketInstance.current = socket;
        socket.on('connect', () => {
            console.log('已连接到服务器');
            socket.emit('joinRoom', {
                roomId: liveInfo.roomId,
                isBroadcaster: true,
                broadcasterToken: token
            })
        });

        socket.on('userJoined', async({socketId}) => {
            const pc = createPeerConnection(socketId, mediaStreamRef.current)
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer)
            socket.emit('offer', { offer, to: socketId })
        })
    }

    // 开始直播，打开媒体设备然后建立socket连接
    const startLive = () => {
        handleGetLocalStream(() => {
            handleConnectIo()
        })

    }

    const createPeerConnection = (socketId, stream) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // 添加本地流
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // 监听 ICE 候选
        pc.onicecandidate = (event) => {
            console.log('ICE主播触发');
            if (event.candidate) {
                socketInstance.current.emit('iceCandidate', { candidate: event.candidate, to: socketId });
            }
        };

        // 监听连接状态
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'disconnected') {
                pc.close();
                setUserList(prevUserList => prevUserList.filter(user => user.socketId !== socketId))
            }
        };

        // peerConnections[socketId] = pc;
        setUserList(prevUserList => [...prevUserList, { socketId, stream, pc }])
        return pc;
    };

    return (
        <div className="screen-capture-container">
            {/* 显示捕获的视频流 */}
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="100%"
                    height="100%"
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
                    <div  className="stop-capture-btn">
                        直播中
                    </div>
                )}
            </div>
        </div>
    );
};

export default Zhubo;