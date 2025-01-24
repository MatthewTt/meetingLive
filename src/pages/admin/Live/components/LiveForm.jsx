import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import request from '../../../../utils/request';
import dayjs from 'dayjs';
import { Select } from 'antd';
import { useState } from 'react';

const LiveForm = ({ visible, initialValues, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [meetingOptions, setMeetingOptions] =useState([])

    useEffect(() => {
        if (visible && initialValues) {
            // Convert date strings to dayjs objects for DatePicker
            const formattedValues = {
                ...initialValues,
                plannedStartTime: initialValues.plannedStartTime ? dayjs(initialValues.plannedStartTime) : null,
                actualStartTime: initialValues.actualStartTime ? dayjs(initialValues.actualStartTime) : null,
                actualEndTime: initialValues.actualEndTime ? dayjs(initialValues.actualEndTime) : null,
            };
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    useEffect(() => {
        request.get('/meeting').then(res => {
            setMeetingOptions(res.data.map(item => ({ label: item.name, value: item.id })))
        })
    }, [])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Convert dayjs objects to ISO strings
            const formData = {
                ...values,
                plannedStartTime: values.plannedStartTime?.toISOString(),
                actualStartTime: values.actualStartTime?.toISOString(),
                actualEndTime: values.actualEndTime?.toISOString(),
            };

            if (initialValues?.id) {
                // Update existing live
                await request.patch(`/live-manage/${initialValues.id}`, formData);
                message.success('直播更新成功');
            } else {
                // Create new live
                await request.post('/live-manage', formData);
                message.success('直播创建成功');
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
            title={initialValues ? '编辑直播' : '创建直播'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{}}
            >
                <Form.Item
                    name="meetingId"
                    label="会议"
                    rules={[{ required: true, message: '请选择会议' }]}
                >
                    <Select options={meetingOptions} >
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="描述"
                    rules={[{ required: true, message: '请输入直播描述' }]}
                >
                    <Input.TextArea rows={4} placeholder="请输入直播描述" />
                </Form.Item>

                <Form.Item
                    name="plannedStartTime"
                    label="预计开始时间"
                    rules={[{ required: true, message: '请选择预计开始时间' }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择预计开始时间"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="actualStartTime"
                    label="实际开始时间"
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择实际开始时间"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="actualEndTime"
                    label="实际结束时间"
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择实际结束时间"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LiveForm; 