import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import request from '../../../utils/request';

const { Option } = Select;

const UserForm = ({ visible, initialValues, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            if (initialValues?.id) {
                await request.patch(`/users`, {...values, id: initialValues.id});
                message.success('用户更新成功');
            } else {
                await request.post('/users', values);
                message.success('用户创建成功');
            }

            onSuccess?.();
            onCancel?.();
        } catch (error) {
            console.error('表单提交失败:', error);
            message.error('操作失败，请重试');
        }
    };

    return (
        <Modal
            title={initialValues ? '编辑用户' : '创建用户'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    type: 2 // 默认为普通用户
                }}
            >
                <Form.Item
                    name="username"
                    label="账号"
                    rules={[
                        { required: true, message: '请输入账号' },
                        { min: 4, message: '账号长度至少4个字符' }
                    ]}
                >
                    <Input placeholder="请输入账号" />
                </Form.Item>

                {!initialValues && (
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '密码长度至少6个字符' }
                        ]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                )}

                <Form.Item
                    name="type"
                    label="账号类型"
                    rules={[{ required: true, message: '请选择账号类型' }]}
                >
                    <Select placeholder="请选择账号类型">
                        <Option value={1}>管理员</Option>
                        <Option value={2}>普通用户</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserForm; 