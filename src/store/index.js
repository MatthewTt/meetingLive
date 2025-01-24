import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

// 配置 Redux store
const store = configureStore({
    reducer: {
        user: userReducer,
        // 这里可以添加其他的reducer
    },
    // 配置中间件，禁用序列化检查（因为可能存在非序列化数据）
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
    // 开启 Redux DevTools
    devTools: process.env.NODE_ENV !== 'production',
});

export default store; 