import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  Rate,
  Divider,
  Alert,
  Tooltip,
  Progress,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  StarOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface 文献条目 {
  id: string;
  标题: string;
  作者: string[];
  期刊: string;
  年份: number;
  摘要: string;
  关键词: string[];
  链接?: string;
  评分: number;
  笔记: string;
  状态: '待读' | '已读' | '重要';
  添加日期: Date;
  类型: '期刊论文' | '会议论文' | '书籍' | '报告' | '其他';
}

interface 文献综述属性 {
  初始数据?: 文献条目[];
}

const 文献综述: React.FC<文献综述属性> = ({ 初始数据 = [] }) => {
  const [文献列表, 设置文献列表] = useState<文献条目[]>(初始数据);
  const [搜索关键词, 设置搜索关键词] = useState('');
  const [筛选状态, 设置筛选状态] = useState<string>('全部');
  const [筛选类型, 设置筛选类型] = useState<string>('全部');
  const [模态框可见, 设置模态框可见] = useState(false);
  const [编辑中的文献, 设置编辑中的文献] = useState<文献条目 | null>(null);
  const [表单] = Form.useForm();

  // 示例数据
  const 示例文献: 文献条目[] = [
    {
      id: '1',
      标题: '人工智能在教育中的应用研究',
      作者: ['张三', '李四'],
      期刊: '教育技术学报',
      年份: 2023,
      摘要: '本文探讨了人工智能技术在现代教育中的应用前景和挑战...',
      关键词: ['人工智能', '教育技术', '个性化学习'],
      链接: 'https://example.com/paper1',
      评分: 4,
      笔记: '这篇文章提供了很好的理论框架',
      状态: '已读',
      添加日期: new Date('2023-12-01'),
      类型: '期刊论文'
    },
    {
      id: '2',
      标题: '深度学习算法优化方法综述',
      作者: ['王五', '赵六'],
      期刊: '计算机学报',
      年份: 2023,
      摘要: '综述了近年来深度学习算法的主要优化方法和技术进展...',
      关键词: ['深度学习', '算法优化', '神经网络'],
      评分: 5,
      笔记: '非常全面的综述文章，值得深入研究',
      状态: '重要',
      添加日期: new Date('2023-11-15'),
      类型: '期刊论文'
    }
  ];

  // 初始化数据
  useEffect(() => {
    if (文献列表.length === 0) {
      设置文献列表(示例文献);
    }
  }, []);

  // 过滤文献
  const 过滤后文献 = 文献列表.filter(文献 => {
    const 匹配搜索 = 搜索关键词 === '' || 
      文献.标题.toLowerCase().includes(搜索关键词.toLowerCase()) ||
      文献.作者.some(作者 => 作者.toLowerCase().includes(搜索关键词.toLowerCase())) ||
      文献.关键词.some(关键词 => 关键词.toLowerCase().includes(搜索关键词.toLowerCase()));
    
    const 匹配状态 = 筛选状态 === '全部' || 文献.状态 === 筛选状态;
    const 匹配类型 = 筛选类型 === '全部' || 文献.类型 === 筛选类型;
    
    return 匹配搜索 && 匹配状态 && 匹配类型;
  });

  // 统计信息
  const 统计信息 = {
    总数: 文献列表.length,
    已读数: 文献列表.filter(文献 => 文献.状态 === '已读').length,
    重要数: 文献列表.filter(文献 => 文献.状态 === '重要').length,
    平均评分: 文献列表.length > 0 ? 
      (文献列表.reduce((sum, 文献) => sum + 文献.评分, 0) / 文献列表.length).toFixed(1) : '0'
  };

  // 表格列定义
  const 表格列: ColumnsType<文献条目> = [
    {
      title: '标题',
      dataIndex: '标题',
      key: '标题',
      width: 300,
      render: (标题: string, 记录: 文献条目) => (
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>
            {标题}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {记录.作者.join(', ')} ({记录.年份})
          </Text>
        </div>
      )
    },
    {
      title: '期刊/会议',
      dataIndex: '期刊',
      key: '期刊',
      width: 150
    },
    {
      title: '类型',
      dataIndex: '类型',
      key: '类型',
      width: 100,
      render: (类型: string) => (
        <Tag color="blue">{类型}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: '状态',
      key: '状态',
      width: 80,
      render: (状态: string) => {
        const 颜色映射 = {
          '待读': 'orange',
          '已读': 'green',
          '重要': 'red'
        };
        return <Tag color={颜色映射[状态 as keyof typeof 颜色映射]}>{状态}</Tag>;
      }
    },
    {
      title: '评分',
      dataIndex: '评分',
      key: '评分',
      width: 120,
      render: (评分: number) => (
        <Rate disabled defaultValue={评分} style={{ fontSize: 14 }} />
      )
    },
    {
      title: '关键词',
      dataIndex: '关键词',
      key: '关键词',
      width: 200,
      render: (关键词: string[]) => (
        <Space size={4} wrap>
          {关键词.slice(0, 3).map(词 => (
            <Tag key={词} size="small">{词}</Tag>
          ))}
          {关键词.length > 3 && <Tag size="small">+{关键词.length - 3}</Tag>}
        </Space>
      )
    },
    {
      title: '操作',
      key: '操作',
      width: 120,
      render: (_, 记录: 文献条目) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => 处理编辑(记录)}
            />
          </Tooltip>
          {记录.链接 && (
            <Tooltip title="访问链接">
              <Button
                type="text"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(记录.链接, '_blank')}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => 处理删除(记录.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 处理添加/编辑
  const 处理提交 = async (values: any) => {
    const 文献数据: 文献条目 = {
      id: 编辑中的文献?.id || Date.now().toString(),
      标题: values.标题,
      作者: values.作者.split(',').map((s: string) => s.trim()),
      期刊: values.期刊,
      年份: values.年份,
      摘要: values.摘要 || '',
      关键词: values.关键词 ? values.关键词.split(',').map((s: string) => s.trim()) : [],
      链接: values.链接,
      评分: values.评分 || 0,
      笔记: values.笔记 || '',
      状态: values.状态,
      添加日期: 编辑中的文献?.添加日期 || new Date(),
      类型: values.类型
    };

    if (编辑中的文献) {
      设置文献列表(prev => prev.map(文献 => 
        文献.id === 编辑中的文献.id ? 文献数据 : 文献
      ));
    } else {
      设置文献列表(prev => [...prev, 文献数据]);
    }

    设置模态框可见(false);
    设置编辑中的文献(null);
    表单.resetFields();
  };

  // 处理编辑
  const 处理编辑 = (文献: 文献条目) => {
    设置编辑中的文献(文献);
    表单.setFieldsValue({
      标题: 文献.标题,
      作者: 文献.作者.join(', '),
      期刊: 文献.期刊,
      年份: 文献.年份,
      摘要: 文献.摘要,
      关键词: 文献.关键词.join(', '),
      链接: 文献.链接,
      评分: 文献.评分,
      笔记: 文献.笔记,
      状态: 文献.状态,
      类型: 文献.类型
    });
    设置模态框可见(true);
  };

  // 处理删除
  const 处理删除 = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文献吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        设置文献列表(prev => prev.filter(文献 => 文献.id !== id));
      }
    });
  };

  // 处理新增
  const 处理新增 = () => {
    设置编辑中的文献(null);
    表单.resetFields();
    设置模态框可见(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>文献综述管理</Title>
          <Paragraph type="secondary">
            管理和组织研究文献，支持分类、评分和笔记功能
          </Paragraph>
        </div>

        {/* 统计概览 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="文献总数"
                value={统计信息.总数}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="已读文献"
                value={统计信息.已读数}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="重要文献"
                value={统计信息.重要数}
                prefix={<StarOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="平均评分"
                value={统计信息.平均评分}
                suffix="/ 5"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 操作栏 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8}>
            <Search
              placeholder="搜索标题、作者或关键词..."
              value={搜索关键词}
              onChange={(e) => 设置搜索关键词(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={筛选状态}
              onChange={设置筛选状态}
              style={{ width: '100%' }}
            >
              <Option value="全部">全部状态</Option>
              <Option value="待读">待读</Option>
              <Option value="已读">已读</Option>
              <Option value="重要">重要</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={筛选类型}
              onChange={设置筛选类型}
              style={{ width: '100%' }}
            >
              <Option value="全部">全部类型</Option>
              <Option value="期刊论文">期刊论文</Option>
              <Option value="会议论文">会议论文</Option>
              <Option value="书籍">书籍</Option>
              <Option value="报告">报告</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={处理新增}
              >
                添加文献
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 文献表格 */}
        <Table
          columns={表格列}
          dataSource={过滤后文献}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条文献`
          }}
          expandable={{
            expandedRowRender: (记录: 文献条目) => (
              <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text strong>摘要：</Text>
                    <Paragraph style={{ marginTop: 8 }}>
                      {记录.摘要 || '暂无摘要'}
                    </Paragraph>
                  </Col>
                  {记录.笔记 && (
                    <Col span={24}>
                      <Text strong>笔记：</Text>
                      <Paragraph style={{ marginTop: 8 }}>
                        {记录.笔记}
                      </Paragraph>
                    </Col>
                  )}
                </Row>
              </div>
            ),
            rowExpandable: (记录) => !!(记录.摘要 || 记录.笔记)
          }}
        />
      </Card>

      {/* 添加/编辑模态框 */}
      <Modal
        title={编辑中的文献 ? '编辑文献' : '添加文献'}
        open={模态框可见}
        onCancel={() => {
          设置模态框可见(false);
          设置编辑中的文献(null);
          表单.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={表单}
          layout="vertical"
          onFinish={处理提交}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="标题"
                label="标题"
                rules={[{ required: true, message: '请输入文献标题' }]}
              >
                <Input placeholder="请输入文献标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="作者"
                label="作者"
                rules={[{ required: true, message: '请输入作者' }]}
              >
                <Input placeholder="多个作者用逗号分隔" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="期刊"
                label="期刊/会议"
                rules={[{ required: true, message: '请输入期刊或会议名称' }]}
              >
                <Input placeholder="请输入期刊或会议名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="年份"
                label="年份"
                rules={[{ required: true, message: '请输入发表年份' }]}
              >
                <Input type="number" placeholder="2023" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="类型"
                label="类型"
                rules={[{ required: true, message: '请选择文献类型' }]}
              >
                <Select placeholder="请选择文献类型">
                  <Option value="期刊论文">期刊论文</Option>
                  <Option value="会议论文">会议论文</Option>
                  <Option value="书籍">书籍</Option>
                  <Option value="报告">报告</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="状态"
                label="状态"
                rules={[{ required: true, message: '请选择阅读状态' }]}
              >
                <Select placeholder="请选择阅读状态">
                  <Option value="待读">待读</Option>
                  <Option value="已读">已读</Option>
                  <Option value="重要">重要</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="关键词" label="关键词">
                <Input placeholder="多个关键词用逗号分隔" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="评分" label="评分">
                <Rate />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="链接" label="链接">
                <Input placeholder="文献链接或DOI" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="摘要" label="摘要">
                <TextArea rows={3} placeholder="请输入文献摘要" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="笔记" label="笔记">
                <TextArea rows={3} placeholder="请输入阅读笔记" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => 设置模态框可见(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {编辑中的文献 ? '更新' : '添加'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default 文献综述;