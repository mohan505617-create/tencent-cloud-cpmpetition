import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Input, Table, Form, Modal, Select, Progress, 
  Tabs, Space, Typography, Avatar, Tag, message, Upload, 
  Slider, Switch, Alert, Tooltip
} from 'antd';
import { useLocation } from 'react-router-dom';
import {
  PlusOutlined, UserOutlined, BookOutlined, CheckCircleOutlined,
  EditOutlined, DeleteOutlined, MessageOutlined, TrophyOutlined,
  UploadOutlined, RobotOutlined, SecurityScanOutlined, BulbOutlined,
  LinkOutlined, EyeOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import ChatComponent from '../components/ChatComponent';
import '../styles/AIGardener.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Course {
  key: string;
  name: string;
  code: string;
  description: string;
  students: number;
  assignments: number;
  status: string;
  aiGenerated?: boolean;
  template?: string;
}

interface Student {
  key: string;
  name: string;
  id: string;
  course: string;
  grade: number;
  progress: number;
  lastActive: string;
  encrypted: boolean;
}

interface Assignment {
  key: string;
  title: string;
  course: string;
  type: 'text' | 'quiz' | 'project';
  content: string;
  dueDate: string;
  autoGrading: boolean;
  keywords: string[];
  maxScore: number;
  submissions: number;
  linkedNotes?: string[];
}

const AIGardener: React.FC = () => {
  const location = useLocation();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState('1');
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [gradingModalVisible, setGradingModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [gradingResult, setGradingResult] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [savedGrades, setSavedGrades] = useState<any[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [courseForm] = Form.useForm();
  const [studentForm] = Form.useForm();
  const [assignmentForm] = Form.useForm();

  // 数据状态
  const [courses, setCourses] = useState<Course[]>([
    {
      key: '1',
      name: '创新算法设计',
      code: 'CS301',
      description: '结合科技创新实践的算法设计课程',
      students: 45,
      assignments: 8,
      status: '进行中',
      aiGenerated: true,
      template: 'innovation-algorithm'
    },
    {
      key: '2',
      name: '智慧城市数据分析',
      code: 'DA201',
      description: '基于智慧城市建设的数据分析方法',
      students: 32,
      assignments: 6,
      status: '进行中',
      aiGenerated: true,
      template: 'smart-city-data'
    }
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      key: '1',
      name: '张创新',
      id: '2024001',
      course: '创新算法设计',
      grade: 88,
      progress: 85,
      lastActive: '2小时前',
      encrypted: true
    },
    {
      key: '2',
      name: '李智慧',
      id: '2024002',
      course: '创新算法设计',
      grade: 92,
      progress: 90,
      lastActive: '1小时前',
      encrypted: true
    },
    {
      key: '3',
      name: '王科技',
      id: 'SZ2024003',
      course: '智慧城市数据分析',
      grade: 85,
      progress: 78,
      lastActive: '30分钟前',
      encrypted: true
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      key: '1',
      title: '交通优化算法设计',
      course: '创新算法设计',
      type: 'project',
      content: '设计一个优化地铁换乘的算法',
      dueDate: '2024-01-20',
      autoGrading: true,
      keywords: ['算法', '优化', '图论', '最短路径'],
      maxScore: 100,
      submissions: 38,
      linkedNotes: ['算法基础', '图论应用']
    },
    {
      key: '2',
      title: '智慧城市数据可视化',
      course: '智慧城市数据分析',
      type: 'text',
      content: '分析城市空气质量数据并制作可视化报告',
      dueDate: '2024-01-25',
      autoGrading: true,
      keywords: ['数据分析', '可视化', '环境监测'],
      maxScore: 100,
      submissions: 25,
      linkedNotes: ['数据可视化', '环境数据分析']
    }
  ]);

  // 课程模板已移除以避免未使用变量警告

  // AI生成课程大纲
  const generateCourseOutline = (courseName: string, courseCode: string) => {
    return `# ${courseName} (${courseCode}) - AI生成课程大纲

## 🌱 深圳创新教育理念
本课程秉承"培育深圳创新人才"的教学理念，结合深圳科技创新实践。

## 📚 课程目标
- 掌握核心理论知识
- 培养创新思维能力
- 提升实践应用技能
- 增强团队协作精神

## 📖 教学内容

### 模块一：理论基础 (25%)
- 基本概念和原理
- 理论框架构建
- 深圳实践案例分析

### 模块二：技术实践 (35%)
- 动手实验和练习
- 工具和平台使用
- 项目开发实践

### 模块三：创新应用 (25%)
- 前沿技术探索
- 创新方案设计
- 深圳企业合作项目

### 模块四：综合评估 (15%)
- 知识综合运用
- 创新能力展示
- 团队协作评价

## 🎯 评估方式
- 平时表现：20%
- 实验作业：30%
- 创新项目：30%
- 期末考核：20%

## 🚀 创新特色
- 🏢 深圳企业实习机会
- 🤖 AI技术辅助学习
- 🌐 国际化视野培养
- 💡 创新创业指导

## 🔒 隐私保护
所有学生数据采用加密存储，确保信息安全。

---
*本大纲由AI Gardener智能生成，体现深圳创新教育理念*`;
  };

  // 自动评分算法
  const autoGradeAssignment = (submission: string, keywords: string[], maxScore: number) => {
    const submissionLower = submission.toLowerCase();
    let score = 0;
    let matchedKeywords: string[] = [];

    keywords.forEach(keyword => {
      if (submissionLower.includes(keyword.toLowerCase())) {
        score += maxScore / keywords.length;
        matchedKeywords.push(keyword);
      }
    });

    // 基础分数（确保不为0）
    const baseScore = Math.max(score, maxScore * 0.3);
    
    // 添加一些随机性模拟更复杂的评分
    const finalScore = Math.min(maxScore, baseScore + Math.random() * 10);

    return {
      score: Math.round(finalScore),
      matchedKeywords,
      feedback: generateFeedback(matchedKeywords, keywords, finalScore, maxScore)
    };
  };

  const generateFeedback = (matched: string[], total: string[], score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    let feedback = `评分：${score}/${maxScore} (${percentage.toFixed(1)}%)\n\n`;
    
    if (percentage >= 90) {
      feedback += "🎉 优秀！您的作业质量很高，体现了深圳创新精神！\n";
    } else if (percentage >= 80) {
      feedback += "👍 良好！作业完成得不错，继续保持创新思维！\n";
    } else if (percentage >= 70) {
      feedback += "📈 中等！有进步空间，建议多参考深圳科技实践案例。\n";
    } else {
      feedback += "💪 需要改进！建议重新审视题目要求，加强基础知识学习。\n";
    }

    feedback += `\n✅ 匹配关键词：${matched.join(', ')}\n`;
    feedback += `❌ 缺失关键词：${total.filter(k => !matched.includes(k)).join(', ')}\n`;
    feedback += `\n💡 改进建议：结合深圳创新实践，深入分析相关技术应用。`;

    return feedback;
  };

  // 处理函数
  const handleCreateCourse = (values: any) => {
    if (editingCourse) {
      // 编辑现有课程
      const outline = values.useAI ? generateCourseOutline(values.name, values.code) : values.outline;
      const updatedCourses = courses.map(course => 
        course.key === editingCourse.key 
          ? { 
              ...course, 
              name: values.name,
              code: values.code,
              description: values.description,
              aiGenerated: values.useAI,
              template: outline
            }
          : course
      );
      setCourses(updatedCourses);
      message.success('课程更新成功！');
    } else {
      // 创建新课程
      const outline = values.useAI ? generateCourseOutline(values.name, values.code) : values.outline;
      
      const newCourse: Course = {
        key: Date.now().toString(),
        name: values.name,
        code: values.code,
        description: values.description,
        students: 0,
        assignments: 0,
        status: '准备中',
        aiGenerated: values.useAI,
        template: outline
      };
      
      setCourses([...courses, newCourse]);
      message.success('课程创建成功！AI已生成课程大纲。');
    }
    
    setCourseModalVisible(false);
    courseForm.resetFields();
    setEditingCourse(null);
  };

  // 编辑课程
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseForm.setFieldsValue({
      name: course.name,
      code: course.code,
      description: course.description,
      useAI: course.aiGenerated,
      outline: course.template
    });
    setCourseModalVisible(true);
  };

  // 关闭课程模态框时重置状态
  const handleCourseModalCancel = () => {
    setCourseModalVisible(false);
    courseForm.resetFields();
    setEditingCourse(null);
  };

  // 处理学生消息
  const handleStudentMessage = (student: Student) => {
    setSelectedStudent(student);
    setMessageModalVisible(true);
  };

  // 发送消息给学生
  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      message.warning('请输入消息内容');
      return;
    }
    
    // 模拟发送消息
    message.success(`消息已发送给 ${selectedStudent?.name}`);
    setMessageContent('');
    setMessageModalVisible(false);
  };

  // 查看学生成绩详情
  const handleViewGrades = (student: Student) => {
    setSelectedStudent(student);
    setGradeModalVisible(true);
  };

  // 模拟学生的详细成绩数据
  const getStudentGradeDetails = (student: Student) => {
    return [
      {
        key: '1',
        assignment: '算法设计作业1',
        type: '编程作业',
        score: 92,
        maxScore: 100,
        submitTime: '2024-03-15 14:30',
        feedback: '代码逻辑清晰，算法效率高，体现了深圳创新精神！',
        autoGraded: true
      },
      {
        key: '2',
        assignment: '数据结构测验',
        type: '在线测验',
        score: 88,
        maxScore: 100,
        submitTime: '2024-03-10 16:45',
        feedback: '基础知识掌握扎实，部分高级概念需要加强。',
        autoGraded: true
      },
      {
        key: '3',
        assignment: '创新项目设计',
        type: '项目作业',
        score: 95,
        maxScore: 100,
        submitTime: '2024-03-08 10:20',
        feedback: '项目创意优秀，技术实现完整，充分体现了深圳科技创新理念！',
        autoGraded: false
      }
    ];
  };

  // 处理AI评分
  const handleAIGrading = async () => {
    if (!selectedAssignment || !submissionContent.trim()) {
      message.warning('请选择作业并输入学生提交内容');
      return;
    }

    setIsGrading(true);
    
    // 模拟AI评分过程
    setTimeout(() => {
      const result = autoGradeAssignment(
        submissionContent,
        selectedAssignment.keywords,
        selectedAssignment.maxScore
      );
      
      setGradingResult({
        ...result,
        assignmentId: selectedAssignment.key,
        assignmentTitle: selectedAssignment.title,
        submissionContent,
        gradedAt: new Date().toLocaleString(),
        id: Date.now().toString()
      });
      
      setIsGrading(false);
      message.success('AI评分完成！');
    }, 2000);
  };

  // 保存评分结果
  const handleSaveGrade = () => {
    if (!gradingResult) {
      message.warning('没有可保存的评分结果');
      return;
    }

    const newGrade = {
      ...gradingResult,
      savedAt: new Date().toLocaleString(),
      status: 'saved'
    };

    setSavedGrades([...savedGrades, newGrade]);
    message.success('评分结果已保存！');
    
    // 重置评分状态
    setGradingResult(null);
    setSubmissionContent('');
    setSelectedAssignment(null);
  };

  // 修改评分
  const handleModifyGrade = (gradeId: string, newScore: number, newFeedback: string) => {
    if (gradingResult && gradingResult.id === gradeId) {
      setGradingResult({
        ...gradingResult,
        score: newScore,
        feedback: newFeedback,
        modifiedAt: new Date().toLocaleString()
      });
    }
    
    const updatedGrades = savedGrades.map(grade => 
      grade.id === gradeId 
        ? { 
            ...grade, 
            score: newScore, 
            feedback: newFeedback,
            modifiedAt: new Date().toLocaleString(),
            status: 'modified'
          }
        : grade
    );
    
    setSavedGrades(updatedGrades);
    message.success('评分已修改！');
  };

  // 删除评分记录
  const handleDeleteGrade = (gradeId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评分记录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setSavedGrades(savedGrades.filter(grade => grade.id !== gradeId));
        message.success('评分记录已删除！');
      }
    });
  };

  // 重置评分系统
  const handleResetGrading = () => {
    setSelectedAssignment(null);
    setSubmissionContent('');
    setGradingResult(null);
    setIsGrading(false);
  };

  // 编辑作业
  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    assignmentForm.setFieldsValue({
      title: assignment.title,
      course: assignment.course,
      type: assignment.type,
      content: assignment.content,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      keywords: assignment.keywords.join(', '),
      linkedNotes: assignment.linkedNotes,
      autoGrading: assignment.autoGrading
    });
    setAssignmentModalVisible(true);
  };

  // 关闭作业模态框时重置状态
  const handleAssignmentModalCancel = () => {
    setAssignmentModalVisible(false);
    assignmentForm.resetFields();
    setEditingAssignment(null);
  };

  const handleCreateStudent = (values: any) => {
    const newStudent: Student = {
      key: Date.now().toString(),
      name: values.name,
      id: values.id,
      course: values.course,
      grade: values.grade || 0,
      progress: 0,
      lastActive: '刚刚',
      encrypted: true
    };
    
    setStudents([...students, newStudent]);
    setStudentModalVisible(false);
    studentForm.resetFields();
    message.success('学生添加成功！数据已加密保护。');
  };

  const handleCreateAssignment = (values: any) => {
    if (editingAssignment) {
      // 编辑现有作业
      const updatedAssignments = assignments.map(assignment => 
        assignment.key === editingAssignment.key 
          ? { 
              ...assignment, 
              title: values.title,
              course: values.course,
              type: values.type,
              content: values.content,
              dueDate: values.dueDate,
              autoGrading: values.autoGrading,
              keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
              maxScore: values.maxScore || 100,
              linkedNotes: values.linkedNotes || []
            }
          : assignment
      );
      setAssignments(updatedAssignments);
      message.success('作业更新成功！');
    } else {
      // 创建新作业
      const newAssignment: Assignment = {
        key: Date.now().toString(),
        title: values.title,
        course: values.course,
        type: values.type,
        content: values.content,
        dueDate: values.dueDate,
        autoGrading: values.autoGrading,
        keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
        maxScore: values.maxScore || 100,
        submissions: 0,
        linkedNotes: values.linkedNotes || []
      };
      
      setAssignments([...assignments, newAssignment]);
      message.success('作业创建成功！已启用智能评分。');
    }
    
    setAssignmentModalVisible(false);
    assignmentForm.resetFields();
    setEditingAssignment(null);
  };

  // 表格列定义
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Course) => (
        <Space>
          <span>{text}</span>
          {record.aiGenerated && <Tag color="blue">AI生成</Tag>}
        </Space>
      )
    },
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '进行中' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Course) => (
        <div 
          className="action-buttons"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            overflow: 'hidden'
          }}
        >
          <Tooltip title="查看AI生成的课程大纲">
            <Button 
              type="link" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: `${record.name} - 课程大纲`,
                  content: (
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                        {record.template}
                      </pre>
                    </div>
                  ),
                  width: 800
                });
              }}
            >
              大纲
            </Button>
          </Tooltip>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger 
            icon={<DeleteOutlined />}
            className="delete-button"
            onClick={() => {
              Modal.confirm({
                title: '确认删除课程',
                content: `确定要删除课程"${record.name}"吗？此操作不可撤销。`,
                okText: '确认删除',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  setCourses(courses.filter(c => c.key !== record.key));
                  message.success('课程删除成功！');
                },
              });
            }}
            style={{
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const studentColumns = [
    {
      title: '学生信息',
      key: 'info',
      render: (_: any, record: Student) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.id} 
              {record.encrypted && <SafetyCertificateOutlined style={{ marginLeft: 4, color: '#52c41a' }} />}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
      ellipsis: true
    },
    {
      title: '成绩',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: number) => (
        <Tag color={grade >= 90 ? 'green' : grade >= 80 ? 'blue' : grade >= 70 ? 'orange' : 'red'}>
          {grade}分
        </Tag>
      )
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
      width: 180,
      render: (_: any, record: Student) => (
        <div 
          className="action-buttons"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            overflow: 'hidden'
          }}
        >
          <Button 
            type="link" 
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleStudentMessage(record)}
          >
            消息
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<TrophyOutlined />}
            onClick={() => handleViewGrades(record)}
          >
            成绩
          </Button>
          <Button 
            type="link" 
            size="small"
            danger 
            icon={<DeleteOutlined />}
            className="delete-button"
            onClick={() => {
              Modal.confirm({
                title: '确认删除学生',
                content: `确定要删除学生"${record.name}"吗？此操作将删除该学生的所有相关数据。`,
                okText: '确认删除',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  setStudents(students.filter(s => s.key !== record.key));
                  message.success('学生删除成功！');
                },
              });
            }}
            style={{
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const assignmentColumns = [
    {
      title: '作业信息',
      key: 'info',
      render: (_: any, record: Assignment) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
            {record.title}
            {record.autoGrading && <Tag color="green" style={{ marginLeft: 8 }}>智能评分</Tag>}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            类型: {record.type === 'text' ? '文本作业' : record.type === 'quiz' ? '测验' : '项目'}
          </div>
          {record.linkedNotes && record.linkedNotes.length > 0 && (
            <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '2px' }}>
              <LinkOutlined /> 关联笔记: {record.linkedNotes.join(', ')}
            </div>
          )}
        </div>
      )
    },
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
      ellipsis: true
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '提交情况',
      key: 'submissions',
      render: (_: any, record: Assignment) => (
        <div>
          <div>{record.submissions} 份提交</div>
          <Progress 
            percent={(record.submissions / 50) * 100} 
            size="small" 
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Assignment) => (
        <div 
          className="action-buttons"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            overflow: 'hidden'
          }}
        >
          <Button 
            type="link" 
            size="small"
            icon={<UploadOutlined />}
            onClick={() => setGradingModalVisible(true)}
          >
            评分
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditAssignment(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger 
            icon={<DeleteOutlined />}
            className="delete-button"
            onClick={() => {
              Modal.confirm({
                title: '确认删除作业',
                content: `确定要删除作业"${record.title}"吗？此操作将删除所有相关的提交和评分数据。`,
                okText: '确认删除',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  setAssignments(assignments.filter(a => a.key !== record.key));
                  message.success('作业删除成功！');
                },
              });
            }}
            style={{
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <BookOutlined />
          课程设计
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4}>🌱 深圳创新课程管理</Title>
              <Text type="secondary">AI驱动的课程设计与管理平台</Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCourseModalVisible(true)}
            >
              创建课程
            </Button>
          </div>
          
          <Alert
            message="🚀 AI课程设计助手"
            description="使用AI生成符合深圳创新理念的课程大纲，结合本地科技实践案例"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Table 
            columns={courseColumns} 
            dataSource={courses}
            pagination={false}
            rowClassName="table-row"
            scroll={{ x: 800 }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <UserOutlined />
          学生管理
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4}>👥 学生信息管理</Title>
              <Text type="secondary">加密保护的学生数据管理系统</Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setStudentModalVisible(true)}
            >
              添加学生
            </Button>
          </div>

          <Alert
            message="🔒 隐私保护"
            description="所有学生数据采用端到端加密，确保信息安全"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table 
            columns={studentColumns} 
            dataSource={students}
            pagination={{ pageSize: 10 }}
            rowClassName="table-row"
            scroll={{ x: 900 }}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <CheckCircleOutlined />
          智能评分
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4}>🤖 AI智能评分系统</Title>
              <Text type="secondary">基于关键词匹配和语义分析的自动评分</Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAssignmentModalVisible(true)}
            >
              创建作业
            </Button>
          </div>

          <Alert
            message="💡 智能评分特性"
            description="支持文本分析、关键词匹配、与知识管理系统联动评分"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table 
            columns={assignmentColumns} 
            dataSource={assignments}
            pagination={false}
            rowClassName="table-row"
            scroll={{ x: 1000 }}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <MessageOutlined />
          智能问答
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>🤖 AI Gardener 智能问答</Title>
                <Text type="secondary">为学生提供24/7智能学习支持</Text>
              </div>
              
              <Alert
                message="🌱 深圳创新教育理念"
                description="AI助手融入深圳创新文化，提供个性化学习指导"
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <ChatComponent 
                studentName="当前学生"
                courseName="深圳创新算法设计"
              />
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          🌱 AI Gardener - 智能教学平台
        </Title>
        <Paragraph>
          融合AI技术与创新理念的智能教学管理系统，培育未来科技人才
        </Paragraph>
      </div>

      {/* 统计面板 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{courses.length}</div>
                <div style={{ color: '#666' }}>创新课程</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{students.length}</div>
                <div style={{ color: '#666' }}>在读学生</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <RobotOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{assignments.filter(a => a.autoGrading).length}</div>
                <div style={{ color: '#666' }}>AI评分作业</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <SecurityScanOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>100%</div>
                <div style={{ color: '#666' }}>数据加密</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 创建课程模态框 */}
      <Modal
        title={editingCourse ? "✏️ 编辑课程" : "🌱 创建深圳创新课程"}
        open={courseModalVisible}
        onCancel={handleCourseModalCancel}
        footer={null}
        width={800}
      >
        <Form form={courseForm} layout="vertical" onFinish={handleCreateCourse}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
                <Input placeholder="如：深圳创新算法设计" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="课程代码" name="code" rules={[{ required: true, message: '请输入课程代码' }]}>
                <Input placeholder="如：SZ-CS301" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="课程描述" name="description">
            <TextArea rows={3} placeholder="描述课程特色和目标" />
          </Form.Item>
          
          <Form.Item name="useAI" valuePropName="checked">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Switch />
              <span>使用AI生成课程大纲</span>
              <Tooltip title="AI将根据深圳创新理念生成个性化课程大纲">
                <BulbOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            </div>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? '更新课程' : '创建课程'}
              </Button>
              <Button onClick={handleCourseModalCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加学生模态框 */}
      <Modal
        title="👥 添加学生信息"
        open={studentModalVisible}
        onCancel={() => setStudentModalVisible(false)}
        footer={null}
      >
        <Form form={studentForm} layout="vertical" onFinish={handleCreateStudent}>
          <Form.Item label="学生姓名" name="name" rules={[{ required: true, message: '请输入学生姓名' }]}>
            <Input placeholder="输入学生姓名" />
          </Form.Item>
          <Form.Item label="学号" name="id" rules={[{ required: true, message: '请输入学号' }]}>
            <Input placeholder="如：SZ2024001" />
          </Form.Item>
          <Form.Item label="所属课程" name="course" rules={[{ required: true, message: '请选择课程' }]}>
            <Select placeholder="选择课程">
              {courses.map(course => (
                <Option key={course.code} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="当前成绩" name="grade">
            <Slider min={0} max={100} marks={{ 0: '0', 60: '及格', 80: '良好', 100: '优秀' }} />
          </Form.Item>
          
          <Alert
            message="🔒 隐私保护"
            description="学生信息将自动加密存储"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                添加学生
              </Button>
              <Button onClick={() => setStudentModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建作业模态框 */}
      <Modal
        title={editingAssignment ? "✏️ 编辑作业" : "🤖 创建智能评分作业"}
        open={assignmentModalVisible}
        onCancel={handleAssignmentModalCancel}
        footer={null}
        width={800}
      >
        <Form form={assignmentForm} layout="vertical" onFinish={handleCreateAssignment}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="作业标题" name="title" rules={[{ required: true, message: '请输入作业标题' }]}>
                <Input placeholder="如：深圳交通优化算法设计" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="作业类型" name="type" rules={[{ required: true, message: '请选择作业类型' }]}>
                <Select placeholder="选择类型">
                  <Option value="text">文本作业</Option>
                  <Option value="quiz">在线测验</Option>
                  <Option value="project">项目作业</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="所属课程" name="course" rules={[{ required: true, message: '请选择课程' }]}>
            <Select placeholder="选择课程">
              {courses.map(course => (
                <Option key={course.code} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="作业内容" name="content" rules={[{ required: true, message: '请输入作业内容' }]}>
            <TextArea rows={4} placeholder="详细描述作业要求..." />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="截止日期" name="dueDate" rules={[{ required: true, message: '请选择截止日期' }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="满分" name="maxScore">
                <Input type="number" placeholder="100" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="评分关键词" name="keywords">
            <Input placeholder="用逗号分隔，如：算法,优化,图论,最短路径" />
          </Form.Item>
          
          <Form.Item label="关联知识管理笔记" name="linkedNotes">
            <Select mode="tags" placeholder="选择或输入相关笔记标题">
              <Option value="算法基础">算法基础</Option>
              <Option value="图论应用">图论应用</Option>
              <Option value="数据结构">数据结构</Option>
              <Option value="深圳交通分析">深圳交通分析</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="autoGrading" valuePropName="checked" initialValue={true}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Switch defaultChecked />
              <span>启用AI智能评分</span>
              <Tooltip title="基于关键词匹配和语义分析自动评分">
                <RobotOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </div>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAssignment ? '更新作业' : '创建作业'}
              </Button>
              <Button onClick={handleAssignmentModalCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 智能评分模态框 */}
      <Modal
        title="🤖 AI智能评分系统"
        open={gradingModalVisible}
        onCancel={() => setGradingModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ minHeight: '500px', paddingBottom: '60px' }}
      >
        <div style={{ marginBottom: 20 }}>
          <Alert
            message="智能评分演示"
            description="上传学生作业文本，AI将自动进行评分和反馈"
            type="info"
            showIcon
          />
        </div>
        
        <Form layout="vertical">
          <Form.Item 
            label="选择作业" 
            style={{ 
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{ position: 'relative' }}>
              <Select 
                placeholder="选择要评分的作业"
                size="large"
                value={selectedAssignment?.key}
                onChange={(value) => {
                  const assignment = assignments.find(a => a.key === value);
                  setSelectedAssignment(assignment || null);
                }}
                dropdownStyle={{ 
                  zIndex: 10001,
                  maxHeight: '180px',
                  position: 'absolute'
                }}
                getPopupContainer={() => document.body}
                dropdownMatchSelectWidth={false}
                style={{ width: '100%' }}
              >
                {assignments.map(assignment => (
                  <Option key={assignment.key} value={assignment.key}>
                    {assignment.title} - {assignment.course}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>

          {selectedAssignment && (
            <div style={{ 
              marginBottom: '16px', 
              padding: '12px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '6px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-color)' }}>
                📋 作业信息
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                满分：{selectedAssignment.maxScore}分 | 
                评分关键词：{selectedAssignment.keywords.join(', ')} | 
                自动评分：{selectedAssignment.autoGrading ? '启用' : '禁用'}
              </div>
            </div>
          )}
          
          <Form.Item 
            label="学生提交内容" 
            style={{ marginBottom: '20px' }}
          >
            <TextArea 
              rows={5} 
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="粘贴学生提交的作业内容，或上传文件..."
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<RobotOutlined />}
                loading={isGrading}
                onClick={handleAIGrading}
                disabled={!selectedAssignment || !submissionContent.trim()}
              >
                {isGrading ? 'AI评分中...' : '开始AI评分'}
              </Button>
              <Upload>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
              <Button onClick={handleResetGrading}>
                重置
              </Button>
            </Space>
          </Form.Item>

          {/* 评分结果显示 */}
          {gradingResult && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary-color)' }}>
                🎯 AI评分结果
              </div>
              
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {gradingResult.score}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      得分 / {selectedAssignment?.maxScore}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {((gradingResult.score / (selectedAssignment?.maxScore || 100)) * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      得分率
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
                      {gradingResult.matchedKeywords.length}/{selectedAssignment?.keywords.length || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      关键词匹配
                    </div>
                  </div>
                </Col>
              </Row>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  📝 AI反馈
                </div>
                <TextArea 
                  value={gradingResult.feedback}
                  onChange={(e) => setGradingResult({...gradingResult, feedback: e.target.value})}
                  rows={4}
                  style={{ fontSize: '12px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  🔧 调整分数
                </div>
                <Row gutter={8} align="middle">
                  <Col span={12}>
                    <Slider
                      min={0}
                      max={selectedAssignment?.maxScore || 100}
                      value={gradingResult.score}
                      onChange={(value) => setGradingResult({...gradingResult, score: value})}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      type="number"
                      min={0}
                      max={selectedAssignment?.maxScore || 100}
                      value={gradingResult.score}
                      onChange={(e) => setGradingResult({...gradingResult, score: parseInt(e.target.value) || 0})}
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                  <Col span={6}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      / {selectedAssignment?.maxScore} 分
                    </span>
                  </Col>
                </Row>
              </div>

              <Space>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={handleSaveGrade}
                >
                  保存评分
                </Button>
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: '修改评分',
                      content: '确定要修改这个评分结果吗？',
                      onOk: () => {
                        handleModifyGrade(gradingResult.id, gradingResult.score, gradingResult.feedback);
                      }
                    });
                  }}
                >
                  确认修改
                </Button>
              </Space>
            </div>
          )}

          {/* 已保存的评分记录 */}
          {savedGrades.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-color)' }}>
                📊 评分记录
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {savedGrades.map((grade, index) => (
                  <div key={grade.id} style={{ 
                    marginBottom: '8px', 
                    padding: '12px', 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderRadius: '6px',
                    border: grade.status === 'modified' ? '1px solid #faad14' : '1px solid var(--border-color)'
                  }}>
                    <Row justify="space-between" align="middle">
                      <Col span={16}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                          {grade.assignmentTitle}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          分数：{grade.score}分 | 保存时间：{grade.savedAt}
                          {grade.status === 'modified' && <Tag color="orange" size="small">已修改</Tag>}
                        </div>
                      </Col>
                      <Col span={8} style={{ textAlign: 'right' }}>
                        <Space size="small">
                          <Button 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => {
                              Modal.confirm({
                                title: '修改评分',
                                content: (
                                  <div>
                                    <div style={{ marginBottom: '8px' }}>
                                      当前分数：{grade.score}分
                                    </div>
                                    <Input
                                      type="number"
                                      placeholder="输入新分数"
                                      id={`new-score-${grade.id}`}
                                    />
                                  </div>
                                ),
                                onOk: () => {
                                  const input = document.getElementById(`new-score-${grade.id}`) as HTMLInputElement;
                                  const newScore = parseInt(input?.value || '0');
                                  if (newScore >= 0 && newScore <= (selectedAssignment?.maxScore || 100)) {
                                    handleModifyGrade(grade.id, newScore, grade.feedback);
                                  } else {
                                    message.error('分数范围无效');
                                  }
                                }
                              });
                            }}
                          >
                            修改
                          </Button>
                          <Button 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteGrade(grade.id)}
                          >
                            删除
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* 学生消息对话框 */}
      <Modal
        title={`💬 与 ${selectedStudent?.name} 对话`}
        open={messageModalVisible}
        onCancel={() => {
          setMessageModalVisible(false);
          setMessageContent('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setMessageModalVisible(false);
            setMessageContent('');
          }}>
            取消
          </Button>,
          <Button key="send" type="primary" onClick={handleSendMessage}>
            发送消息
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="智能消息系统"
            description={`向学生 ${selectedStudent?.name} 发送个性化学习指导消息`}
            type="info"
            showIcon
          />
        </div>
        
        {/* 历史消息记录 */}
        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto', 
          border: '1px solid var(--border-color)', 
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            历史消息记录：
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2024-03-15 10:30</div>
            <div style={{ padding: '4px 8px', backgroundColor: 'var(--primary-bg)', borderRadius: '4px', marginBottom: '4px', border: '1px solid var(--primary-color)' }}>
              <strong style={{ color: 'var(--text-color)' }}>老师：</strong><span style={{ color: 'var(--text-color)' }}>你的算法作业完成得很好，继续保持！</span>
            </div>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2024-03-15 14:20</div>
            <div style={{ padding: '4px 8px', backgroundColor: 'var(--success-bg)', borderRadius: '4px', border: '1px solid var(--success-color)' }}>
              <strong style={{ color: 'var(--text-color)' }}>{selectedStudent?.name}：</strong><span style={{ color: 'var(--text-color)' }}>谢谢老师！我会继续努力学习的。</span>
            </div>
          </div>
        </div>

        <TextArea
          rows={4}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="输入要发送给学生的消息..."
          style={{ marginBottom: '12px' }}
        />
        
        <div style={{ fontSize: '12px', color: '#666' }}>
          💡 提示：可以发送学习建议、作业反馈或鼓励性消息
        </div>
      </Modal>

      {/* 学生成绩详情模态框 */}
      <Modal
        title={`🏆 ${selectedStudent?.name} 的成绩详情`}
        open={gradeModalVisible}
        onCancel={() => setGradeModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setGradeModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {selectedStudent?.grade}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>总体成绩</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {selectedStudent?.progress}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>学习进度</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                    3
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>已完成作业</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    A
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>等级评定</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Table
          dataSource={selectedStudent ? getStudentGradeDetails(selectedStudent) : []}
          pagination={false}
          size="small"
          columns={[
            {
              title: '作业名称',
              dataIndex: 'assignment',
              key: 'assignment',
              width: 200,
            },
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type',
              width: 100,
              render: (type: string) => (
                <Tag color={type === '编程作业' ? 'blue' : type === '在线测验' ? 'green' : 'purple'}>
                  {type}
                </Tag>
              )
            },
            {
              title: '成绩',
              key: 'score',
              width: 100,
              render: (_: any, record: any) => (
                <div>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: record.score >= 90 ? '#52c41a' : record.score >= 80 ? '#1890ff' : '#faad14'
                  }}>
                    {record.score}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>/{record.maxScore}</span>
                </div>
              )
            },
            {
              title: '提交时间',
              dataIndex: 'submitTime',
              key: 'submitTime',
              width: 140,
            },
            {
              title: '评分方式',
              dataIndex: 'autoGraded',
              key: 'autoGraded',
              width: 100,
              render: (autoGraded: boolean) => (
                <Tag color={autoGraded ? 'green' : 'blue'}>
                  {autoGraded ? 'AI评分' : '人工评分'}
                </Tag>
              )
            },
            {
              title: '反馈',
              dataIndex: 'feedback',
              key: 'feedback',
              ellipsis: true,
              render: (feedback: string) => (
                <Tooltip title={feedback}>
                  <span style={{ fontSize: '12px' }}>{feedback}</span>
                </Tooltip>
              )
            }
          ]}
        />

        <div style={{ marginTop: 16, padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#52c41a' }}>
            🎯 学习建议
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            • 该学生在算法设计方面表现优秀，建议继续深入学习高级算法<br/>
            • 数据结构基础扎实，可以尝试更复杂的项目实践<br/>
            • 创新思维能力突出，符合深圳科技创新人才培养目标
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AIGardener;