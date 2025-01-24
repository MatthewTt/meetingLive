import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import styles from './index.module.css';

const UploadFile = ({ value, onChange, maxSize = 5, accept = 'image/*' }) => {
    const [loading, setLoading] = useState(false);

    // 上传前校验
    const beforeUpload = (file) => {
        // 检查文件类型
        const isAcceptedType = accept === '*/*' || file.type.match(accept.replace('*', '.*'));
        if (!isAcceptedType) {
            message.error(`只能上传 ${accept} 类型的文件`);
            return false;
        }

        // 检查文件大小
        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            message.error(`文件必须小于 ${maxSize}MB!`);
            return false;
        }

        return true;
    };

    // 自定义上传方法
    const customUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            setLoading(true);
            const response = await request.post('/upload/files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const url = response.data.url;
            onChange?.(url);
            onSuccess(response, file);
            message.success('上传成功');
        } catch (error) {
            onError(error);
            message.error('上传失败');
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className={styles.uploadText}>上传</div>
        </div>
    );

    return (
        <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            className={styles.uploader}
        >
            {value ? (
                <img 
                    src={value} 
                    alt="avatar" 
                    className={styles.uploadedImage}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};

export default UploadFile; 