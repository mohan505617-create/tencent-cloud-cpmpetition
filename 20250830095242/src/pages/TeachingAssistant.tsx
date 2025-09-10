import React, { useState } from 'react';
import { Card, Row, Col, Button, Input, Table, Form, Modal, Select, Progress, Tabs, Space, Typography, List, Avatar, Tag, message } from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TeachingAssistant: React.FC = () => {
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [courseForm] = Form.useForm();
  const [assignmentForm] = Form.useForm();

  // 课程和作业状态管理
  const [courses, setCourses] = useState([
    {
      key: '1',
      name: '数据结构与算法',
      code: 'CS201',
      students: 45,
      assignments: 8,
      status: '进行中'
    },
    {
      key: '2',
      name: '机器学习基础',
      code: 'CS301',
      students: 32,
      assignments: 6,
      status: '进行中'
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      key: '1',
      title: '二叉树遍历算法',
      course: '数据结构与算法',
      dueDate: '2024-01-15',
      submitted: 38,
      total: 45,
      status: '进行中'
    },
    {
      key: '2',
      title: '线性回归实现',
      course: '机器学习基础',
      dueDate: '2024-01-20',
      submitted: 25,
      total: 32,
      status: '进行中'
    }
  ]);

  const students = [
    {
      key: '1',
      name: '张三',
      id: '2021001',
      course: '数据结构与算法',
      progress: 85,
      lastActive: '2小时前'
    },
    {
      key: '2',
      name: '李四',
      id: '2021002',
      course: '数据结构与算法',
      progress: 72,
      lastActive: '1天前'
    },
    {
      key: '3',
      name: '王五',
      id: '2021003',
      course: '机器学习基础',
      progress: 90,
      lastActive: '30分钟前'
    }
  ];

  // 处理课程创建
  const handleCreateCourse = (values: any) => {
    const newCourse = {
      key: Date.now().toString(),
      name: values.name,
      code: values.code,
      students: 0,
      assignments: 0,
      status: '进行中'
    };
    
    setCourses([...courses, newCourse]);
    setCourseModalVisible(false);
    courseForm.resetFields();
    message.success('课程创建成功！');
  };

  // 处理作业创建
  const handleCreateAssignment = (values: any) => {
    const newAssignment = {
      key: Date.now().toString(),
      title: values.title,
      course: values.course,
      dueDate: values.dueDate,
      submitted: 0,
      total: courses.find(c => c.code === values.course)?.students || 0,
      status: '进行中'
    };
    
    setAssignments([...assignments, newAssignment]);
    setAssignmentModalVisible(false);
    assignmentForm.resetFields();
    message.success('作业创建成功！');
  };

  // 删除课程
  const handleDeleteCourse = (courseKey: string) => {
    setCourses(courses.filter(course => course.key !== courseKey));
    message.success('课程删除成功！');
  };

  // 删除作业
  const handleDeleteAssignment = (assignmentKey: string) => {
    setAssignments(assignments.filter(assignment => assignment.key !== assignmentKey));
    message.success('作业删除成功！');
  };

  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '学生数量',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '作业数量',
      dataIndex: 'assignments',
      key: 'assignments',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '进行中' ? 'green' : 'blue'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<UserOutlined />}>
            学生
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCourse(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: '学习进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<MessageOutlined />}>
            消息
          </Button>
          <Button type="link" icon={<TrophyOutlined />}>
            成绩
          </Button>
        </Space>
      ),
    },
  ];

  const assignmentColumns = [
    {
      title: '作业标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '提交情况',
      key: 'submission',
      render: (record: any) => (
        <span>{record.submitted}/{record.total}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '进行中' ? 'orange' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<CheckCircleOutlined />}>
            批改
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAssignment(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const recentQuestions = [
    {
      title: '关于二叉树的平衡问题',
      student: '张三',
      course: '数据结构与算法',
      time: '1小时前',
      status: '待回复'
    },
    {
      title: '梯度下降算法的收敛性',
      student: '王五',
      course: '机器学习基础',
      time: '3小时前',
      status: '已回复'
    }
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '课程管理',
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>我的课程</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCourseModalVisible(true)}
            >
              创建课程
            </Button>
          </div>
          <Table 
            columns={courseColumns} 
            dataSource={courses}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: '学生管理',
      children: (
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>学生列表</Title>
          <Table 
            columns={studentColumns} 
            dataSource={students}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: '作业管理',
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>作业列表</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAssignmentModalVisible(true)}
            >
              创建作业
            </Button>
          </div>
          <Table 
            columns={assignmentColumns} 
            dataSource={assignments}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'AI问答',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="💬 AI智能问答">
              <div style={{ 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ 
                  flex: 1, 
                  background: '#f5f5f5', 
                  padding: 16, 
                  borderRadius: 8,
                  marginBottom: 16
                }}>
                  <p style={{ color: '#666', textAlign: 'center', marginTop: 150 }}>
                    AI助手准备就绪，可以回答学生问题
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input.TextArea 
                    placeholder="输入问题或让AI帮助回答学生疑问..."
                    rows={3}
                  />
                  <Button type="primary" style={{ height: 'auto' }}>
                    发送
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="📋 最近问题">
              <List
                itemLayout="horizontal"
                dataSource={recentQuestions}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<MessageOutlined />} />}
                      title={item.title}
                      description={
                        <div>
                          <div>{item.student} - {item.course}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <small style={{ color: '#999' }}>{item.time}</small>
                            <Tag color={item.status === '待回复' ? 'orange' : 'green'} size="small">
                              {item.status}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          👨‍🏫 AI Gardener - 超级教学助手
        </Title>
        <Paragraph>
          智能化课程管理、学生跟踪、作业评分和AI问答系统
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{courses.length}</div>
                <div style={{ color: '#666' }}>活跃课程</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>77</div>
                <div style={{ color: '#666' }}>学生总数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{assignments.length}</div>
                <div style={{ color: '#666' }}>待批作业</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <MessageOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>3</div>
                <div style={{ color: '#666' }}>待回复问题</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" items={tabItems} />

      {/* 创建课程模态框 */}
      <Modal
        title="创建新课程"
        open={courseModalVisible}
        onCancel={() => setCourseModalVisible(false)}
        footer={null}
      >
        <Form form={courseForm} layout="vertical" onFinish={handleCreateCourse}>
          <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
            <Input placeholder="输入课程名称" />
          </Form.Item>
          <Form.Item label="课程代码" name="code" rules={[{ required: true, message: '请输入课程代码' }]}>
            <Input placeholder="输入课程代码" />
          </Form.Item>
          <Form.Item label="课程描述" name="description">
            <TextArea rows={4} placeholder="输入课程描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建课程
              </Button>
              <Button onClick={() => setCourseModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建作业模态框 */}
      <Modal
        title="创建新作业"
        open={assignmentModalVisible}
        onCancel={() => setAssignmentModalVisible(false)}
        footer={null}
      >
        <Form form={assignmentForm} layout="vertical" onFinish={handleCreateAssignment}>
          <Form.Item label="作业标题" name="title" rules={[{ required: true, message: '请输入作业标题' }]}>
            <Input placeholder="输入作业标题" />
          </Form.Item>
          <Form.Item label="所属课程" name="course" rules={[{ required: true, message: '请选择课程' }]}>
            <Select placeholder="选择课程">
              {courses.map(course => (
                <Option key={course.code} value={course.code}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="截止日期" name="dueDate" rules={[{ required: true, message: '请选择截止日期' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="作业描述" name="description">
            <TextArea rows={4} placeholder="输入作业要求和描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建作业
              </Button>
              <Button onClick={() => setAssignmentModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeachingAssistant;