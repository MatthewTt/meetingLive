import {Alert, Button, Descriptions, Image, Tag} from "antd";
import styles from "./index.module.css";
import qrcode from '../../../assets/qrcodeTemp.png'
const Me = () => {

    const items= [
        {
            key: '1',
            label: '姓名',
            children: <p>王五</p>,
        },
        {
            key: '2',
            label: '年龄',
            children: <p>29</p>,
        },
        {
            key: '3',
            label: '联系电话',
            children: <p>13044567411</p>,
        },
        {
            key: '4',
            label: '身份证',
            children: <p>332522188007308410</p>,
        },
        {
            key: '5',
            label: '报名会议',
            children: <p>智慧科技与未来发展峰会</p>,
        },
        {
            key: '6',
            label: '审核状态',
            children: <Tag color="red">未通过</Tag>,
        },
    ];
  return (
    <div className={styles.meContainer}>
        <Descriptions title="报名信息" bordered items={items} column={1} />
        <Button type='primary'>修改信息</Button>

        {/*二维码*/}
        {/*<Alert message="二维码用于现场签到，请及时保存" type="error" />

        <Image src={qrcode} width={200} />*/}

    </div>
  )
}

export default Me