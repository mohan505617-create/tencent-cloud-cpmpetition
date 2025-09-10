import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, List, Avatar, Tag, Button, Space, Alert, Typography } from 'antd';
import {
  BookOutlined,
  ExperimentOutlined,
  UserOutlined,
  BarChartOutlined,
  RocketOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  LinkOutlined,
  FileTextOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  // 模拟数据 - 实际应用中应该从全局状态或API获取
  const dashboardData = {
    knowledge: {
      totalNotes: 42,
      recentNotes: 8,
      totalTags: 15,
      linkedNotes: 23
    },
    research: {
      collectedData: 12,
      processedData: 8,
      analysisResults: 5,
      completedProjects: 3
    },
    teaching: {
      activeCourses: 2,
      totalStudents: 77,
      pendingAssignments: 14,
      gradedAssignments: 23
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'knowledge',
      title: '创建了新笔记：机器学习基础',
      time: '2小时前',
      icon: <BookOutlined />,
      color: '#1890ff'
    },
    {
      id: 2,
      type: 'research',
      title: '完成数据分析：学生成绩趋势',
      time: '4小时前',
      icon: <BarChartOutlined />,
      color: '#52c41a'
    },
    {
      id: 3,
      type: 'teaching',
      title: '批改作业：数据结构课程',
      time: '6小时前',
      icon: <UserOutlined />,
      color: '#722ed1'
    },
    {
      id: 4,
      type: 'knowledge',
      title: '更新笔记链接：算法复杂度',
      time: '1天前',
      icon: <LinkOutlined />,
      color: '#1890ff'
    }
  ];

  const quickActions = [
    {
      title: '创建新笔记',
      icon: <FileTextOutlined />,
      action: () => navigate('/knowledge'),
      color: '#1890ff'
    },
    {
      title: '数据分析',
      icon: <BarChartOutlined />,
      action: () => navigate('/research'),
      color: '#52c41a'
    },
    {
      title: '课程管理',
      icon: <UserOutlined />,
      action: () => navigate('/teaching'),
      color: '#722ed1'
    },
    {
      title: '查看报告',
      icon: <DatabaseOutlined />,
      action: () => navigate('/reports'),
      color: '#fa8c16'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 欢迎区域 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          欢迎回到 EduAI Hub
        </Title>
        <Paragraph>
          今天是 {currentTime.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}，让我们开始高效的学习和教学之旅！
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="知识笔记"
              value={dashboardData.knowledge.totalNotes}
              prefix={<BookOutlined />}
              suffix="篇"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">最近新增 {dashboardData.knowledge.recentNotes} 篇</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="研究数据"
              value={dashboardData.research.collectedData}
              prefix={<ExperimentOutlined />}
              suffix="项"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">已处理 {dashboardData.research.processedData} 项</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学生总数"
              value={dashboardData.teaching.totalStudents}
              prefix={<UserOutlined />}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">活跃课程 {dashboardData.teaching.activeCourses} 门</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完成项目"
              value={dashboardData.research.completedProjects}
              prefix={<TrophyOutlined />}
              suffix="个"
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">分析结果 {dashboardData.research.analysisResults} 个</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card title="最近活动" extra={<Button type="link">查看全部</Button>}>
            <Timeline>
              {recentActivities.map((activity) => (
                <Timeline.Item
                  key={activity.id}
                  dot={
                    <Avatar
                      size="small"
                      style={{ backgroundColor: activity.color }}
                      icon={activity.icon}
                    />
                  }
                >
                  <div>
                    <Text strong>{activity.title}</Text>
                    <br />
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {activity.time}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* 快速操作 */}
        <Col xs={24} lg={12}>
          <Card title="快速操作">
            <Row gutter={[8, 8]}>
              {quickActions.map((action, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Button
                    block
                    icon={action.icon}
                    onClick={action.action}
                    style={{
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: action.color,
                      color: action.color
                    }}
                  >
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      {action.title}
                    </div>
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 进度概览 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="知识管理进度">
            <div style={{ marginBottom: 16 }}>
              <Text>笔记链接完成度</Text>
              <Progress 
                percent={Math.round((dashboardData.knowledge.linkedNotes / dashboardData.knowledge.totalNotes) * 100)} 
                status="active"
              />
            </div>
            <div>
              <Text>标签分类完成度</Text>
              <Progress 
                percent={Math.round((dashboardData.knowledge.totalTags / 20) * 100)} 
                status="active"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="研究项目进度">
            <div style={{ marginBottom: 16 }}>
              <Text>数据处理进度</Text>
              <Progress 
                percent={Math.round((dashboardData.research.processedData / dashboardData.research.collectedData) * 100)} 
                status="active"
              />
            </div>
            <div>
              <Text>分析完成度</Text>
              <Progress 
                percent={Math.round((dashboardData.research.analysisResults / dashboardData.research.processedData) * 100)} 
                status="active"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="教学任务进度">
            <div style={{ marginBottom: 16 }}>
              <Text>作业批改进度</Text>
              <Progress 
                percent={Math.round((dashboardData.teaching.gradedAssignments / (dashboardData.teaching.gradedAssignments + dashboardData.teaching.pendingAssignments)) * 100)} 
                status="active"
              />
            </div>
            <div>
              <Text>课程完成度</Text>
              <Progress 
                percent={75} 
                status="active"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统状态提示 */}
      <Alert
        message="🎉 系统运行正常"
        description={
          <div>
            <Text>所有模块运行正常，数据同步完成。</Text>
            <br />
            <Text type="secondary">
              上次同步时间: {currentTime.toLocaleString()} | 
              在线用户: 1 | 
              系统版本: v2.0.0
            </Text>
          </div>
        }
        type="success"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default Dashboard;