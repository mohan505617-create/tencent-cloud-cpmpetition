import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Button,
  Space,
  Divider,
  Alert,
  Collapse,
  Tag,
  Timeline,
  Anchor,
  BackTop
} from 'antd';
import {
  BookOutlined,
  RocketOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  BulbOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const 用户指南: React.FC = () => {
  const navigate = useNavigate();
  const [当前步骤, 设置当前步骤] = useState(0);

  // 快速开始步骤
  const 快速开始步骤 = [
    {
      title: '创建账户',
      description: '注册并完善个人信息',
      content: '首次使用需要创建账户，填写基本信息以获得个性化体验。'
    },
    {
      title: '探索功能',
      description: '了解平台主要功能模块',
      content: '浏览各个功能模块，包括知识管理、AI助手、研究工具等。'
    },
    {
      title: '开始使用',
      description: '创建第一个项目或笔记',
      content: '开始创建您的第一个知识项目，体验智能化的学习管理。'
    }
  ];

  // 功能介绍
  const 功能模块 = [
    {
      icon: <BookOutlined />,
      title: '知识管理',
      description: '智能整理和管理学习资料',
      features: ['文档上传', '自动分类', '智能标签', '全文搜索'],
      path: '/knowledge'
    },
    {
      icon: <RocketOutlined />,
      title: 'AI助手',
      description: '个性化学习辅导和答疑',
      features: ['智能问答', '学习建议', '内容总结', '知识图谱'],
      path: '/ai-assistant'
    },
    {
      icon: <ToolOutlined />,
      title: '研究工具',
      description: '专业的学术研究辅助工具',
      features: ['文献管理', '数据分析', '图表生成', '报告导出'],
      path: '/research'
    }
  ];

  // 常见问题
  const 常见问题 = [
    {
      question: '如何上传和管理文档？',
      answer: '在知识管理模块中，点击"上传文档"按钮，支持PDF、Word、PPT等多种格式。上传后系统会自动提取内容并进行智能分类。'
    },
    {
      question: '如何使用AI助手功能？',
      answer: 'AI助手可以帮助您解答问题、总结内容、生成学习计划等。直接在对话框中输入问题，AI会基于您的知识库提供个性化回答。'
    },
    {
      question: '如何创建和管理学习项目？',
      answer: '在项目管理页面点击"新建项目"，设置项目名称、目标和时间计划。可以将相关文档、笔记和任务关联到项目中。'
    },
    {
      question: '如何导出学习报告？',
      answer: '在研究工具模块中，选择需要导出的内容，点击"生成报告"，支持PDF、Word等格式导出。'
    }
  ];

  // 使用技巧
  const 使用技巧 = [
    {
      title: '快捷键使用',
      tips: [
        'Ctrl+K：快速搜索',
        'Ctrl+N：新建笔记',
        'Ctrl+S：保存内容',
        'Ctrl+/：显示帮助'
      ]
    },
    {
      title: '高效学习方法',
      tips: [
        '使用标签系统组织知识',
        '定期回顾和总结',
        '利用AI助手深度学习',
        '建立知识关联图谱'
      ]
    },
    {
      title: '协作功能',
      tips: [
        '分享学习笔记',
        '协作编辑文档',
        '讨论学习问题',
        '建立学习小组'
      ]
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>
          <BookOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          用户指南
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          欢迎使用EduAI Hub！这里是您的学习助手使用指南
        </Paragraph>
      </div>

      {/* 快速开始 */}
      <Card style={{ marginBottom: '32px' }}>
        <Title level={2}>
          <RocketOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          快速开始
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Steps
              current={当前步骤}
              direction="vertical"
              size="small"
            >
              {快速开始步骤.map((步骤, 索引) => (
                <Step
                  key={索引}
                  title={步骤.title}
                  description={步骤.description}
                  icon={索引 <= 当前步骤 ? <CheckCircleOutlined /> : undefined}
                />
              ))}
            </Steps>
          </Col>
          <Col xs={24} lg={8}>
            <Alert
              message="开始您的学习之旅"
              description={快速开始步骤[当前步骤]?.content}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate('/welcome')}
              >
                立即开始
              </Button>
              <Button
                onClick={() => 设置当前步骤((prev) => Math.min(prev + 1, 快速开始步骤.length - 1))}
                disabled={当前步骤 >= 快速开始步骤.length - 1}
              >
                下一步
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 功能介绍 */}
      <Card style={{ marginBottom: '32px' }}>
        <Title level={2}>
          <ToolOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
          功能介绍
        </Title>
        <Row gutter={[24, 24]}>
          {功能模块.map((模块, 索引) => (
            <Col xs={24} md={8} key={索引}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => navigate(模块.path)}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '8px' }}>
                    {模块.icon}
                  </div>
                  <Title level={4}>{模块.title}</Title>
                  <Paragraph type="secondary">{模块.description}</Paragraph>
                </div>
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>
                    主要功能：
                  </Text>
                  <Space size={4} wrap>
                    {模块.features.map((功能, 功能索引) => (
                      <Tag key={功能索引} color="blue">{功能}</Tag>
                    ))}
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 使用技巧 */}
      <Card style={{ marginBottom: '32px' }}>
        <Title level={2}>
          <BulbOutlined style={{ marginRight: '8px', color: '#faad14' }} />
          使用技巧
        </Title>
        <Row gutter={[24, 24]}>
          {使用技巧.map((技巧组, 索引) => (
            <Col xs={24} md={8} key={索引}>
              <Card size="small" title={技巧组.title}>
                <Timeline size="small">
                  {技巧组.tips.map((技巧, 技巧索引) => (
                    <Timeline.Item
                      key={技巧索引}
                      dot={<StarOutlined style={{ color: '#1890ff' }} />}
                    >
                      <Text>{技巧}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 常见问题 */}
      <Card>
        <Title level={2}>
          <QuestionCircleOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
          常见问题
        </Title>
        <Collapse accordion>
          {常见问题.map((问题, 索引) => (
            <Panel
              header={问题.question}
              key={索引}
              extra={<QuestionCircleOutlined />}
            >
              <Paragraph>{问题.answer}</Paragraph>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* 返回顶部 */}
      <BackTop />

      {/* 底部操作 */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Space size="large">
          <Button size="large" onClick={() => navigate('/welcome')}>
            返回首页
          </Button>
          <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
            开始使用
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default 用户指南;