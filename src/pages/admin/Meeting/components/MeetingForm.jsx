import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Modal, message, DatePicker, Upload } from 'antd';
import request from '../../../../utils/request';
import dayjs from 'dayjs';
import UploadFile from '../../../../components/UploadFile';

const MeetingForm = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const isEdit = !!initialValues?.id;

    useEffect(() => {
        if (visible && initialValues) {
            const formValues = {
                ...initialValues,
                meetingTime: dayjs(initialValues.meetingTime)
            };
            form.setFieldsValue(formValues);
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values) => {
        try {
            const submitData = {
                ...values,
            };

            if (isEdit) {
                await request.patch(`/meeting/${initialValues.id}`, submitData);
                message.success('更新会议成功');
            } else {
                await request.post('/meeting', submitData);
                message.success('创建会议成功');
            }
            onSuccess?.();
            onCancel?.();
            form.resetFields();
        } catch (error) {
            console.error('操作失败:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel?.();
    };

    return (
        <Modal
            title={isEdit ? '编辑会议' : '添加会议'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="会议名称"
                    rules={[{ required: true, message: '请输入会议名称' }]}
                >
                    <Input placeholder="请输入会议名称" />
                </Form.Item>
                <Form.Item
                    name="cover"
                    label="会议封面"
                    rules={[{ required: true, message: '请上传会议封面' }]}
                >
                    <UploadFile />
                </Form.Item>
                <Form.Item
                    name="meetingTime"
                    label="会议时间"
                    rules={[{ required: true, message: '请选择会议时间' }]}
                >
                    <DatePicker 
                        placeholder="请选择会议时间"
                        style={{ width: '100%' }}
                        showTime
                    />
                </Form.Item>
                <Form.Item
                    name="location"
                    label="会议地点"
                    rules={[{ required: true, message: '请输入会议地点' }]}
                >
                    <Input placeholder="请输入会议地点" />
                </Form.Item>
                <Form.Item 
                    name='guestInfo' 
                    label="嘉宾介绍" 
                    rules={[{ required: true, message: '请输入嘉宾介绍' }]}
                >
                    <Input.TextArea placeholder="请输入嘉宾介绍" />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button onClick={handleCancel}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MeetingForm; 