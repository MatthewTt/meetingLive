import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    userInfo: null,
    isAuthenticated: !!localStorage.getItem('token')
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, role } = action.payload;
            state.token = token;
            state.role = role;
            state.isAuthenticated = true;
            // 同时保存到localStorage作为持久化
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.userInfo = null;
            state.isAuthenticated = false;
            // 清除localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        }
    }
});

export const { setCredentials, setUserInfo, logout } = userSlice.actions;

// 选择器
export const selectCurrentUser = (state) => state.user.userInfo;
export const selectCurrentToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserRole = (state) => state.user.role;

export default userSlice.reducer; 