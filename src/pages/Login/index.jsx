import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setCredentials } from '../../store/slices/userSlice';
import request from '../../utils/request';
import styles from './index.module.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await request.post('/auth', {
                username: values.username,
                password: values.password
            });

            // 使用Redux存储token和角色
            dispatch(setCredentials({
                token: response.data.accessToken,
                role: response.data.type
            }));
            
            message.success('登录成功！');
            
            // 根据用户角色跳转到不同页面
            if (response.data.type === 1) {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            // 错误已经在request拦截器中处理
            console.error('Login error:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card} title="欢迎登录" bordered={false}>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名！',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码！',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
