import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  List,
  Avatar,
  Divider,
  Select,
  Tabs,
  Empty,
  Spin,
  Badge,
  Tooltip,
  Alert
} from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import type { TabsProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface 搜索结果项 {
  id: string;
  标题: string;
  内容: string;
  类型: '文档' | '笔记' | '课程' | '用户';
  作者: string;
  创建时间: Date;
  更新时间: Date;
  标签: string[];
  评分: number;
  查看次数: number;
  匹配度: number;
}

const 搜索页面: React.FC = () => {
  const navigate = useNavigate();
  const [搜索关键词, 设置搜索关键词] = useState('');
  const [搜索结果, 设置搜索结果] = useState<搜索结果项[]>([]);
  const [加载中, 设置加载中] = useState(false);
  const [筛选类型, 设置筛选类型] = useState<string>('全部');
  const [排序方式, 设置排序方式] = useState<string>('相关性');
  const [当前标签, 设置当前标签] = useState<string[]>([]);

  // 示例数据
  const 示例数据: 搜索结果项[] = [
    {
      id: '1',
      标题: '人工智能基础教程',
      内容: '本教程涵盖了人工智能的基本概念、机器学习算法、深度学习框架等核心内容...',
      类型: '文档',
      作者: '张教授',
      创建时间: new Date('2023-11-01'),
      更新时间: new Date('2023-12-01'),
      标签: ['人工智能', '机器学习', '教程'],
      评分: 4.8,
      查看次数: 1250,
      匹配度: 0.95
    },
    {
      id: '2',
      标题: '数据结构学习笔记',
      内容: '详细记录了数据结构课程的重点内容，包括数组、链表、栈、队列、树等...',
      类型: '笔记',
      作者: '李同学',
      创建时间: new Date('2023-10-15'),
      更新时间: new Date('2023-11-20'),
      标签: ['数据结构', '算法', '笔记'],
      评分: 4.5,
      查看次数: 890,
      匹配度: 0.87
    },
    {
      id: '3',
      标题: '高等数学进阶课程',
      内容: '涵盖微积分、线性代数、概率论等高等数学核心内容的进阶课程...',
      类型: '课程',
      作者: '王教授',
      创建时间: new Date('2023-09-01'),
      更新时间: new Date('2023-12-05'),
      标签: ['数学', '微积分', '线性代数'],
      评分: 4.9,
      查看次数: 2100,
      匹配度: 0.82
    }
  ];

  // 初始化数据
  useEffect(() => {
    设置搜索结果(示例数据);
  }, []);

  // 配置 Fuse.js 搜索
  const fuse = useMemo(() => {
    return new Fuse(示例数据, {
      keys: ['标题', '内容', '作者', '标签'],
      threshold: 0.3,
      includeScore: true
    });
  }, []);

  // 执行搜索
  const 执行搜索 = (关键词: string) => {
    if (!关键词.trim()) {
      设置搜索结果(示例数据);
      return;
    }

    设置加载中(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const 结果 = fuse.search(关键词);
      const 处理后结果 = 结果.map(result => ({
        ...result.item,
        匹配度: 1 - (result.score || 0)
      }));
      设置搜索结果(处理后结果);
      设置加载中(false);
    }, 500);
  };

  // 过滤和排序结果
  const 过滤后结果 = useMemo(() => {
    let 结果 = 搜索结果;

    // 按类型筛选
    if (筛选类型 !== '全部') {
      结果 = 结果.filter(item => item.类型 === 筛选类型);
    }

    // 按标签筛选
    if (当前标签.length > 0) {
      结果 = 结果.filter(item => 
        当前标签.some(标签 => item.标签.includes(标签))
      );
    }

    // 排序
    switch (排序方式) {
      case '相关性':
        结果.sort((a, b) => b.匹配度 - a.匹配度);
        break;
      case '时间':
        结果.sort((a, b) => b.更新时间.getTime() - a.更新时间.getTime());
        break;
      case '评分':
        结果.sort((a, b) => b.评分 - a.评分);
        break;
      case '热度':
        结果.sort((a, b) => b.查看次数 - a.查看次数);
        break;
    }

    return 结果;
  }, [搜索结果, 筛选类型, 排序方式, 当前标签]);

  // 获取所有标签
  const 所有标签 = useMemo(() => {
    const 标签集合 = new Set<string>();
    搜索结果.forEach(item => {
      item.标签.forEach(标签 => 标签集合.add(标签));
    });
    return Array.from(标签集合);
  }, [搜索结果]);

  // 统计信息
  const 统计信息 = {
    总数: 过滤后结果.length,
    文档数: 过滤后结果.filter(item => item.类型 === '文档').length,
    笔记数: 过滤后结果.filter(item => item.类型 === '笔记').length,
    课程数: 过滤后结果.filter(item => item.类型 === '课程').length
  };

  // 渲染搜索结果项
  const 渲染结果项 = (item: 搜索结果项) => {
    const 类型图标映射 = {
      '文档': <FileTextOutlined />,
      '笔记': <BookOutlined />,
      '课程': <BookOutlined />,
      '用户': <UserOutlined />
    };

    const 类型颜色映射 = {
      '文档': 'blue',
      '笔记': 'green',
      '课程': 'orange',
      '用户': 'purple'
    };

    return (
      <List.Item
        key={item.id}
        actions={[
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/${item.类型}/${item.id}`)}
            />
          </Tooltip>,
          <Tooltip title="收藏">
            <Button type="text" icon={<StarOutlined />} />
          </Tooltip>
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              icon={类型图标映射[item.类型]}
              style={{ backgroundColor: '#1890ff' }}
            />
          }
          title={
            <Space>
              <Text strong style={{ fontSize: '16px' }}>
                {item.标题}
              </Text>
              <Tag color={类型颜色映射[item.类型]}>
                {item.类型}
              </Tag>
              {item.匹配度 > 0.9 && (
                <Badge status="success" text="高匹配" />
              )}
            </Space>
          }
          description={
            <div>
              <Paragraph
                ellipsis={{ rows: 2, expandable: false }}
                style={{ marginBottom: '8px', color: '#666' }}
              >
                {item.内容}
              </Paragraph>
              <Space split={<Divider type="vertical" />} size="small">
                <Text type="secondary">
                  <UserOutlined /> {item.作者}
                </Text>
                <Text type="secondary">
                  <CalendarOutlined /> {item.更新时间.toLocaleDateString('zh-CN')}
                </Text>
                <Text type="secondary">
                  <EyeOutlined /> {item.查看次数}
                </Text>
                <Text type="secondary">
                  <StarOutlined /> {item.评分}
                </Text>
              </Space>
              <div style={{ marginTop: '8px' }}>
                <Space size={4} wrap>
                  {item.标签.map(标签 => (
                    <Tag
                      key={标签}
                      size="small"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!当前标签.includes(标签)) {
                          设置当前标签([...当前标签, 标签]);
                        }
                      }}
                    >
                      {标签}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          }
        />
      </List.Item>
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2}>
          <SearchOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          智能搜索
        </Title>
        <Paragraph type="secondary">
          快速找到您需要的学习资源和知识内容
        </Paragraph>
      </div>

      {/* 搜索框 */}
      <Card style={{ marginBottom: '24px' }}>
        <Search
          placeholder="输入关键词搜索文档、笔记、课程..."
          size="large"
          value={搜索关键词}
          onChange={(e) => 设置搜索关键词(e.target.value)}
          onSearch={执行搜索}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          }
          loading={加载中}
        />
      </Card>

      {/* 筛选和排序 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Space>
              <Text strong>筛选：</Text>
              <Select
                value={筛选类型}
                onChange={设置筛选类型}
                style={{ width: 120 }}
              >
                <Option value="全部">全部类型</Option>
                <Option value="文档">文档</Option>
                <Option value="笔记">笔记</Option>
                <Option value="课程">课程</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>排序：</Text>
              <Select
                value={排序方式}
                onChange={设置排序方式}
                style={{ width: 120 }}
              >
                <Option value="相关性">相关性</Option>
                <Option value="时间">更新时间</Option>
                <Option value="评分">评分</Option>
                <Option value="热度">查看次数</Option>
              </Select>
            </Space>
          </Col>
          <Col flex="auto">
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary">
                找到 {统计信息.总数} 个结果
                {搜索关键词 && ` (关键词: "${搜索关键词}")`}
              </Text>
            </div>
          </Col>
        </Row>

        {/* 已选标签 */}
        {当前标签.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Text strong style={{ marginRight: '8px' }}>已选标签：</Text>
            <Space size={4} wrap>
              {当前标签.map(标签 => (
                <Tag
                  key={标签}
                  closable
                  onClose={() => 设置当前标签(当前标签.filter(t => t !== 标签))}
                  color="blue"
                >
                  {标签}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>

      {/* 搜索结果 */}
      <Row gutter={[24, 24]}>
        {/* 主要结果 */}
        <Col xs={24} lg={18}>
          <Card>
            <Tabs defaultActiveKey="all">
              <TabPane
                tab={`全部 (${统计信息.总数})`}
                key="all"
              >
                <Spin spinning={加载中}>
                  {过滤后结果.length === 0 ? (
                    <Empty
                      description={
                        搜索关键词 ? '未找到相关结果' : '请输入关键词开始搜索'
                      }
                    />
                  ) : (
                    <List
                      itemLayout="vertical"
                      dataSource={过滤后结果}
                      renderItem={渲染结果项}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `第 ${range[0]}-${range[1]} 条，共 ${total} 条结果`
                      }}
                    />
                  )}
                </Spin>
              </TabPane>
              <TabPane
                tab={`文档 (${统计信息.文档数})`}
                key="documents"
              >
                <List
                  dataSource={过滤后结果.filter(item => item.类型 === '文档')}
                  renderItem={渲染结果项}
                />
              </TabPane>
              <TabPane
                tab={`笔记 (${统计信息.笔记数})`}
                key="notes"
              >
                <List
                  dataSource={过滤后结果.filter(item => item.类型 === '笔记')}
                  renderItem={渲染结果项}
                />
              </TabPane>
              <TabPane
                tab={`课程 (${统计信息.课程数})`}
                key="courses"
              >
                <List
                  dataSource={过滤后结果.filter(item => item.类型 === '课程')}
                  renderItem={渲染结果项}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={6}>
          {/* 热门标签 */}
          <Card title="热门标签" size="small" style={{ marginBottom: '16px' }}>
            <Space size={4} wrap>
              {所有标签.slice(0, 10).map(标签 => (
                <Tag
                  key={标签}
                  style={{ cursor: 'pointer' }}
                  color={当前标签.includes(标签) ? 'blue' : 'default'}
                  onClick={() => {
                    if (当前标签.includes(标签)) {
                      设置当前标签(当前标签.filter(t => t !== 标签));
                    } else {
                      设置当前标签([...当前标签, 标签]);
                    }
                  }}
                >
                  {标签}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* 搜索提示 */}
          <Card title="搜索提示" size="small">
            <List size="small">
              <List.Item>
                <Text>使用引号搜索精确短语</Text>
              </List.Item>
              <List.Item>
                <Text>使用 + 号包含必需词汇</Text>
              </List.Item>
              <List.Item>
                <Text>使用 - 号排除特定词汇</Text>
              </List.Item>
              <List.Item>
                <Text>点击标签快速筛选</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default 搜索页面;