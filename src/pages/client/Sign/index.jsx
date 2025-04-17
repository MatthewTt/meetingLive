import {Button, Form, Input, message, Select} from "antd";
import request from "../../../utils/request.js";
import {useEffect, useState} from "react";

const Sign = () => {
    const [form] = Form.useForm();
    const [meetingList, setMeetingList] = useState([])

    useEffect(() => {
        getMeetingList()
    }, [])
    const getMeetingList = async () => {
        const result = await request.get(`/meeting`)
        setMeetingList(result.data)
    }

    const onSubmit = async (values) => {
        const result = await request.post('/sign', values)
        message.success('suc')
    }
    return (
        <div>
            <Form form={form} onFinish={onSubmit}>
                <Form.Item label='姓名' name='name'>
                    <Input />
                </Form.Item>
                <Form.Item label='年龄' name='age'>
                    <Input />
                </Form.Item>
                <Form.Item label='身份证' name='idCard'>
                    <Input />
                </Form.Item>
                <Form.Item label='手机号码' name='phoneNumber'>
                    <Input />
                </Form.Item>
                <Form.Item label='会议' name='meetingId'>
                    <Select >
                        {
                            meetingList.map(item => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>提交</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Sign