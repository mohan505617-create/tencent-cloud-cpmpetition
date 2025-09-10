import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Typography, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Fuse from 'fuse.js';

const { Text } = Typography;

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'course' | 'research' | 'student';
  category: string;
}

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ visible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: '机器学习基础',
      content: '深度学习、神经网络、监督学习相关内容',
      type: 'note',
      category: '知识笔记'
    },
    {
      id: '2',
      title: '数据结构与算法',
      content: '排序算法、树结构、图论基础知识',
      type: 'course',
      category: '课程内容'
    },
    {
      id: '3',
      title: '学生成绩分析',
      content: '期末考试成绩统计与分析报告',
      type: 'research',
      category: '研究数据'
    },
    {
      id: '4',
      title: '张三',
      content: '计算机科学专业，大三学生',
      type: 'student',
      category: '学生信息'
    }
  ];

  const fuse = new Fuse(mockData, {
    keys: ['title', 'content', 'category'],
    threshold: 0.3,
  });

  useEffect(() => {
    if (searchTerm.trim()) {
      setLoading(true);
      // 模拟搜索延迟
      const timer = setTimeout(() => {
        const searchResults = fuse.search(searchTerm).map(result => result.item);
        setResults(searchResults);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const getTypeColor = (type: string) => {
    const colors = {
      note: 'blue',
      course: 'green',
      research: 'orange',
      student: 'purple'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeText = (type: string) => {
    const texts = {
      note: '笔记',
      course: '课程',
      research: '研究',
      student: '学生'
    };
    return texts[type as keyof typeof texts] || type;
  };

  return (
    <Modal
      title="全局搜索"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        placeholder="搜索笔记、课程、研究数据..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="large"
        style={{ marginBottom: 16 }}
      />
      
      {searchTerm && (
        <List
          loading={loading}
          dataSource={results}
          locale={{
            emptyText: <Empty description="未找到相关内容" />
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    <Text strong>{item.title}</Text>
                    <Tag color={getTypeColor(item.type)} style={{ marginLeft: 8 }}>
                      {getTypeText(item.type)}
                    </Tag>
                  </div>
                }
                description={item.content}
              />
            </List.Item>
          )}
        />
      )}
      
      {!searchTerm && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          输入关键词搜索课程信息、学生数据和研究资料
        </div>
      )}
    </Modal>
  );
};

export default GlobalSearch;