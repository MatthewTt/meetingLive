const Home = () => {
    // 模拟的数据
    const [data, setData] = useState({
        registrationCount: 0, // 总报名人数
        systemVisits: 0, // 系统访问量
        conferenceRegistrations: 0, // 会议报名量
    });

    // 假设每个会议的报名人数
    const conferenceData = [
        { conference: '2025年度前端开发大会', registrations: 150 },
        { conference: '2025年度人工智能论坛', registrations: 200 },
        { conference: '2025年度创业创新峰会', registrations: 120 },
        { conference: '2025年度区块链技术大会', registrations: 180 },
        { conference: '2025年度大数据技术论坛', registrations: 220 },
    ];

    // 模拟过去7天的系统访问量（每天的访问量）
    const dailyVisits = [
        { date: '2025-02-01', visits: 800 },
        { date: '2025-02-02', visits: 900 },
        { date: '2025-02-03', visits: 1100 },
        { date: '2025-02-04', visits: 1200 },
        { date: '2025-02-05', visits: 950 },
        { date: '2025-02-06', visits: 1050 },
        { date: '2025-02-07', visits: 1300 },
    ];

    // 计算总报名人数、系统访问量和会议报名量
    useEffect(() => {
        const totalRegistrations = conferenceData.reduce((sum, item) => sum + item.registrations, 0);
        setData({
            registrationCount: totalRegistrations,
            systemVisits: Math.floor(Math.random() * 10000) + 5000, // 随机生成一个系统访问量
            conferenceRegistrations: conferenceData.reduce((sum, item) => sum + item.registrations, 0) / conferenceData.length, // 会议平均值
        });
    }, []);

    // 饼图配置（显示报名人数比例）
    const pieChartOptions = {
        title: {
            text: '报名人数分布',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                name: '报名人数',
                type: 'pie',
                radius: '50%',
                data: conferenceData.map(item => ({
                    value: item.registrations,
                    name: item.conference,
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    // 柱状图配置（显示各会议报名量）
    const barChartOptions = {
        title: {
            text: '各会议报名量',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: conferenceData.map(item => item.conference),
            axisLabel: {
                rotate: 45, // x轴标签倾斜
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '报名人数',
                type: 'bar',
                data: conferenceData.map(item => item.registrations),
                itemStyle: {
                    color: '#4caf50',
                },
            },
        ],
    };

    // 系统访问量柱状图配置（显示7天内的访问人次）
    const visitsBarChartOptions = {
        title: {
            text: '7天系统访问量',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: dailyVisits.map(item => item.date),
            axisLabel: {
                rotate: 45, // x轴标签倾斜
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '访问人次',
                type: 'bar',
                data: dailyVisits.map(item => item.visits),
                itemStyle: {
                    color: '#ff9800',
                },
            },
        ],
    };

    return (
        <>
            <div style={{padding: '0 50px'}}>
                <h2>系统数据概览</h2>
                <ul style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 24}}>
                    <li style={{ width: '33%', borderRadius: 30, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#4caf50'}}>总报名人数: {data.registrationCount}</li>
                    <li style={{ width: '33%', borderRadius: 30, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' , background: '#ff9800'}}>系统访问量: {data.systemVisits}</li>
                    <li style={{ width: '33%', borderRadius: 30, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2196f3'}}>会议平均人数: {data.conferenceRegistrations}</li>
                </ul>
            </div>

            <div style={{padding: '20px', display: 'flex', marginTop: 100, justifyContent: 'space-between'}}>

                <div style={{height: '400px', width: 400}}>
                    <ReactECharts option={pieChartOptions}/>
                </div>
                <div style={{height: '400px', width: 400}}>
                    <ReactECharts option={barChartOptions}/>
                </div>
                <div style={{height: '400px', width: 400}}>
                    <ReactECharts option={visitsBarChartOptions}/>
                </div>
            </div>
        </>

    );
};
import React, {useState, useEffect} from 'react';

import ReactECharts from 'echarts-for-react';

export default Home;
