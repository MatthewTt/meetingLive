import axios from 'axios';
import { message } from 'antd';
import store from '../store/index';
import { logout } from '../store/slices/userSlice';

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:3009',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从Redux store获取token
        const token = store.getState().user.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 如果接口返回的是二进制数据，直接返回
        if (response.config.responseType === 'blob') {
            return response;
        }
        
        // 统一处理响应
        const res = response.data;
        console.log(res)
        if (res.code === 1) {
            return res;
        } else {
            message.error(res.message || '请求失败');
            return Promise.reject(new Error(res.message || '请求失败'));
        }
    },
    error => {
        // 处理错误响应
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // token过期或未登录，触发登出action
                    console.log('登录过期')
                    store.dispatch(logout());
                    message.error('登录已过期，请重新登录');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('没有权限访问');
                    break;
                case 404:
                    message.error('请求的资源不存在');
                    break;
                case 500:
                    message.error('服务器错误');
                    break;
                default:
                    message.error(error.response.data?.message || '请求失败');
            }
        } else if (error.request) {
            message.error('网络错误，请检查网络连接');
        } else {
            message.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default request; 