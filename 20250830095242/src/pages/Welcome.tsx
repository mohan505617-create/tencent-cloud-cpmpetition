import React from 'react';
import { Card, Typography, Row, Col, Button, Space, Timeline, Tag } from 'antd';
import { 
  BookOutlined, 
  ExperimentOutlined, 
  UserOutlined, 
  DashboardOutlined,
  RocketOutlined,
  StarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const 欢迎页面: React.FC = () => {
  const 导航 = useNavigate();

  const 功能特色 = [
    {
      icon: <DashboardOutlined className="feature-icon" />,
      title: '智能仪表板',
      description: '全面掌握学习和研究进度，数据可视化展示'
    },
    {
      icon: <BookOutlined className="feature-icon" />,
      title: '知识管理', 
      description: '高效组织和管理您的知识库，支持多种格式'
    },
    {
      icon: <ExperimentOutlined className="feature-icon" />,
      title: '数字谱系',
      description: '智能研究助手，协助数据分析和学术研究'
    },
    {
      icon: <UserOutlined className="feature-icon" />,
      title: 'AI园丁',
      description: '个性化教学助手，提供智能教学支持'
    }
  ];

  const 平台优势 = [
    '提升学习效率，智能化知识管理',
    '加速研究进程，数据驱动决策',
    '个性化教学体验，因材施教',
    '无缝协作平台，团队共享资源'
  ];

  return (
    <div className="welcome-container">
      {/* 头部横幅 */}
      <div className="welcome-header">
        <div className="header-content">
          <div className="cityu-branding">
            <div className="branding-text">
              <Title level={1} className="main-title">
                欢迎使用 EduAI Hub
              </Title>
              <Title level={3} className="subtitle">
                智能教育平台，传承数字遗产，培育创新人才
              </Title>
              <Text className="university-name">
                香港城市大学
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="welcome-content">
        <Row gutter={[24, 24]}>
          {/* 系统介绍 */}
          <Col xs={24} lg={16}>
            <Card className="intro-card">
              <Title level={2}>
                <RocketOutlined /> 为什么选择 EduAI Hub？
              </Title>
              <Paragraph className="intro-text">
                EduAI Hub 是香港城市大学开发的综合性智能教育平台，致力于为师生提供先进的数字化学习和研究工具。
              </Paragraph>
              
              <Title level={3}>数字遗产传承</Title>
              <Paragraph className="intro-text">
                我们相信知识是人类最宝贵的财富。通过智能化的知识管理系统，帮助您构建、保存和传承珍贵的学术成果。
              </Paragraph>
              
              <Title level={3}>平台优势</Title>
              <Timeline
                items={[
                  {
                    children: <Text><strong>数字传承：</strong>继承并发展学校的教育传统和学术精神</Text>
                  },
                  {
                    children: <Text><strong>智能整合：</strong>四大模块无缝协作，数据互通共享</Text>
                  },
                  {
                    children: <Text><strong>个性定制：</strong>根据用户需求提供个性化的学习和研究体验</Text>
                  },
                  {
                    children: <Text><strong>持续创新：</strong>不断融入最新的AI技术，保持平台的先进性</Text>
                  }
                ]}
              />
              
              <Title level={3}>开始您的智能学习之旅</Title>
              <Timeline
                items={[
                  {
                    children: '创建您的个人知识库，导入现有资料',
                    color: 'blue'
                  },
                  {
                    children: '使用AI助手进行智能分析和研究',
                    color: 'green'
                  },
                  {
                    children: '与团队协作，共享知识和成果',
                    color: 'orange'
                  },
                  {
                    children: '持续学习，构建您的数字遗产',
                    color: 'red'
                  }
                ]}
              />
            </Card>
          </Col>

          {/* 功能特色 */}
          <Col xs={24} lg={8}>
            <Card className="features-card">
              <Title level={3}>
                <StarOutlined /> 核心功能
              </Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {功能特色.map((功能, 索引) => (
                  <Card key={索引} size="small" className="feature-item">
                    <Space>
                      {功能.icon}
                      <div>
                        <Text strong>{功能.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {功能.description}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>

            <Card className="benefits-card" style={{ marginTop: 16 }}>
              <Title level={4}>平台优势</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {平台优势.map((优势, 索引) => (
                  <Tag key={索引} color="blue" style={{ margin: '2px 0', padding: '4px 8px' }}>
                    {优势}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 行动按钮 */}
        <div className="welcome-actions">
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />}
              onClick={() => 导航('/')}
            >
              立即开始
            </Button>
            <Button 
              size="large" 
              onClick={() => 导航('/guide')}
            >
              使用指南
            </Button>
          </Space>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .welcome-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 60px 0;
          text-align: center;
          color: white;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .main-title {
          color: white !important;
          font-size: 3rem !important;
          font-weight: 700 !important;
          margin-bottom: 16px !important;
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 400 !important;
          margin-bottom: 8px !important;
        }
        
        .university-name {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 1.1rem !important;
        }
        
        .welcome-content {
          max-width: 1200px;
          margin: -40px auto 0;
          padding: 0 24px 60px;
          position: relative;
          z-index: 1;
        }
        
        .intro-card, .features-card, .benefits-card {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: none;
        }
        
        .feature-item {
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          border-color: #1890ff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        }
        
        .feature-icon {
          font-size: 24px;
          color: #1890ff;
        }
        
        .welcome-actions {
          text-align: center;
          margin-top: 40px;
        }
        
        .intro-text {
          font-size: 16px;
          line-height: 1.6;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .main-title {
            font-size: 2rem !important;
          }
          
          .welcome-content {
            margin-top: -20px;
            padding: 0 16px 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default 欢迎页面;

// 同时导出英文名称以保持兼容性
export { 欢迎页面 as Welcome };