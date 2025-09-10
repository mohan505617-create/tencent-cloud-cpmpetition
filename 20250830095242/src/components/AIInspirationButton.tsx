import React, { useState } from 'react';
import { Button, Modal, List, Typography, Spin } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Inspiration {
  id: string;
  title: string;
  description: string;
  action: string;
}

const AIInspirationButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);

  const generateInspirations = async () => {
    setLoading(true);
    
    // 模拟AI生成灵感的过程
    setTimeout(() => {
      const mockInspirations: Inspiration[] = [
        {
          id: '1',
          title: '将研究数据应用到教学中',
          description: '利用最新的学生学习数据来优化课程设计',
          action: '创建基于数据的个性化学习路径'
        },
        {
          id: '2',
          title: '知识图谱可视化',
          description: '将笔记中的概念关系转化为可视化图表',
          action: '生成概念关联图'
        },
        {
          id: '3',
          title: '智能课程推荐',
          description: '基于学生表现推荐相关的学习资源',
          action: '创建推荐系统'
        },
        {
          id: '4',
          title: '跨模块数据整合',
          description: '整合不同模块的数据生成综合报告',
          action: '生成整合分析报告'
        }
      ];
      
      setInspirations(mockInspirations);
      setLoading(false);
    }, 1500);
  };

  const handleOpen = () => {
    setVisible(true);
    generateInspirations();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<BulbOutlined />}
        onClick={handleOpen}
        style={{
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          border: 'none',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        AI 灵感
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
            AI 智能灵感建议
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>AI正在分析您的数据，生成个性化建议...</Text>
            </div>
          </div>
        ) : (
          <List
            dataSource={inspirations}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" key="action">
                    {item.action}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export default AIInspirationButton;