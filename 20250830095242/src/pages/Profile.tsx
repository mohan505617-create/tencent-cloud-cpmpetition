import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  Row, 
  Col, 
  Divider, 
  Tag, 
  Progress, 
  Timeline, 
  Statistic,
  Space,
  Typography,
  Alert,
  message,
  Select,
  DatePicker,
  Switch
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  TrophyOutlined,
  BookOutlined,
  TeamOutlined,
  StarOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// 已移除多语言支持

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  avatar?: string;
  bio: string;
  department: string;
  year: string;
  phone?: string;
  address?: string;
  joinDate: string;
  coursePreferences: string[];
  academicAchievements: AcademicAchievement[];
  mentorshipRecord: MentorshipRecord;
}

interface AcademicAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'publication' | 'project' | 'competition';
  mentor?: string;
}

interface MentorshipRecord {
  currentMentor?: string;
  mentorshipHistory: {
    mentor: string;
    period: string;
    focus: string;
  }[];
  mentoringOthers: {
    mentee: string;
    period: string;
    focus: string;
  }[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  // 临时翻译函数，避免页面崩溃
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      'profile.title': '个人资料',
      'profile.subtitle': '管理您的个人信息和学术档案',
      'profile.actions.save': '保存',
      'profile.actions.edit': '编辑',
      'profile.basicInfo.title': '基本信息',
      'profile.basicInfo.changeAvatar': '更换头像',
      'profile.basicInfo.name': '姓名',
      'profile.basicInfo.namePlaceholder': '请输入您的姓名',
      'profile.basicInfo.studentId': '学号',
      'profile.basicInfo.studentIdPlaceholder': '请输入学号',
      'profile.basicInfo.email': '邮箱',
      'profile.basicInfo.emailPlaceholder': '请输入邮箱地址',
      'profile.basicInfo.phone': '电话',
      'profile.basicInfo.phonePlaceholder': '请输入电话号码',
      'profile.basicInfo.department': '院系',
      'profile.basicInfo.departmentPlaceholder': '请选择院系',
      'profile.basicInfo.year': '年级',
      'profile.basicInfo.yearPlaceholder': '请选择年级',
      'profile.basicInfo.bio': '个人简介',
      'profile.basicInfo.bioPlaceholder': '请输入个人简介',
      'profile.departments.computerScience': '计算机科学系',
      'profile.departments.engineering': '工程学院',
      'profile.departments.business': '商学院',
      'profile.departments.humanities': '人文社会科学院',
      'profile.departments.scienceEngineering': '科学及工程学院',
      'profile.overview.title': '学术概览',
      'profile.overview.achievements': '学术成就',
      'profile.overview.mentorship': '导师记录',
      'profile.overview.coursePreferences': '课程偏好',
      'profile.messages.updateSuccess': '个人资料更新成功',
      'profile.messages.updateError': '个人资料更新失败'
    };
    return translations[key] || key;
  };
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 模拟用户数据 - 实际应用中应从API获取
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    username: 'student2024',
    email: 'student@cityu.edu.hk',
    firstName: '志明',
    lastName: '陈',
    studentId: '54321098',
    bio: '计算机科学专业学生，对人工智能和机器学习充满热情。积极参与学术研究和社区服务。',
    department: '计算机科学系',
    year: '2024',
    phone: '+852 9876 5432',
    address: '香港九龙塘达之路83号',
    joinDate: '2021-09-01',
    coursePreferences: ['人工智能', '机器学习', '数据科学', '软件工程'],
    academicAchievements: [
      {
        id: '1',
        title: '优秀学生奖学金',
        description: '2023年度学术表现优异，获得优秀学生奖学金',
        date: '2023-12-15',
        type: 'award',
        mentor: '李教授'
      },
      {
        id: '2',
        title: '机器学习研究项目',
        description: '参与导师指导的深度学习项目，发表学术论文一篇',
        date: '2023-08-20',
        type: 'project',
        mentor: '王教授'
      },
      {
        id: '3',
        title: 'ACM程序设计竞赛',
        description: '香港地区ACM程序设计竞赛银奖',
        date: '2023-05-10',
        type: 'competition'
      }
    ],
    mentorshipRecord: {
      currentMentor: '李教授 - 人工智能实验室',
      mentorshipHistory: [
        {
          mentor: '李教授',
          period: '2023年9月 - 至今',
          focus: '深度学习与计算机视觉'
        },
        {
          mentor: '王教授',
          period: '2022年9月 - 2023年8月',
          focus: '数据结构与算法'
        }
      ],
      mentoringOthers: [
        {
          mentee: '新生张同学',
          period: '2024年2月 - 至今',
          focus: '编程基础指导'
        }
      ]
    }
  });

  useEffect(() => {
    // 初始化表单数据
    form.setFieldsValue({
      ...userProfile,
      joinDate: dayjs(userProfile.joinDate)
    });
  }, [userProfile, form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = {
        ...userProfile,
        ...values,
        joinDate: values.joinDate?.format('YYYY-MM-DD') || userProfile.joinDate
      };
      
      setUserProfile(updatedProfile);
      setEditing(false);
      message.success(t('profile.messages.updateSuccess'));
    } catch (error) {
      message.error(t('profile.messages.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'award': return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'publication': return <BookOutlined style={{ color: '#1890ff' }} />;
      case 'project': return <StarOutlined style={{ color: '#52c41a' }} />;
      case 'competition': return <TrophyOutlined style={{ color: '#722ed1' }} />;
      default: return <StarOutlined />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'award': return 'gold';
      case 'publication': return 'blue';
      case 'project': return 'green';
      case 'competition': return 'purple';
      default: return 'default';
    }
  };

  return (
    <div className="profile-container fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面头部 - 香港城市大学品牌 */}
      <Card className="university-header" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)', color: 'white' }}>
        <Row align="middle">
          <Col flex="auto">
            <Space size="large">
              <div style={{ fontSize: '48px' }}>🎓</div>
              <div>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {t('profile.title')}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  City University of Hong Kong - Academic Profile
                </Text>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  {t('profile.subtitle')}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              ghost 
              icon={editing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => editing ? form.submit() : setEditing(true)}
              loading={loading}
              size="large"
            >
              {editing ? t('profile.actions.save') : t('profile.actions.edit')}
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 左侧 - 基本信息 */}
        <Col xs={24} lg={8}>
          <Card title={t('profile.basicInfo.title')} className="hover-lift">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: '16px' }}
              />
              <br />
              <Upload showUploadList={false}>
                <Button icon={<CameraOutlined />} size="small">
                  {t('profile.basicInfo.changeAvatar')}
                </Button>
              </Upload>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!editing}
            >
              <Form.Item name="firstName" label={t('profile.basicInfo.name')}>
                <Input placeholder={t('profile.basicInfo.namePlaceholder')} />
              </Form.Item>
              
              <Form.Item name="studentId" label={t('profile.basicInfo.studentId')}>
                <Input placeholder={t('profile.basicInfo.studentIdPlaceholder')} />
              </Form.Item>
              
              <Form.Item name="email" label={t('profile.basicInfo.email')}>
                <Input prefix={<MailOutlined />} placeholder={t('profile.basicInfo.emailPlaceholder')} />
              </Form.Item>
              
              <Form.Item name="phone" label={t('profile.basicInfo.phone')}>
                <Input prefix={<PhoneOutlined />} placeholder={t('profile.basicInfo.phonePlaceholder')} />
              </Form.Item>
              
              <Form.Item name="department" label={t('profile.basicInfo.department')}>
                <Select placeholder={t('profile.basicInfo.departmentPlaceholder')}>
                  <Option value="计算机科学系">{t('profile.departments.computerScience')}</Option>
                  <Option value="工程学院">{t('profile.departments.engineering')}</Option>
                  <Option value="商学院">{t('profile.departments.business')}</Option>
                  <Option value="人文社会科学院">{t('profile.departments.humanities')}</Option>
                  <Option value="科学及工程学院">{t('profile.departments.scienceEngineering')}</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="year" label={t('profile.basicInfo.year')}>
                <Select placeholder={t('profile.basicInfo.yearPlaceholder')}>
                  <Option value="2024">2024</Option>
                  <Option value="2023">2023</Option>
                  <Option value="2022">2022</Option>
                  <Option value="2021">2021</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="bio" label={t('profile.basicInfo.bio')}>
                <TextArea rows={4} placeholder={t('profile.basicInfo.bioPlaceholder')} />
              </Form.Item>
            </Form>
          </Card>

          {/* 学术统计 */}
          <Card title={t('profile.overview.title')} style={{ marginTop: '24px' }} className="hover-lift">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={t('profile.overview.achievements')}
                  value={userProfile.academicAchievements.length}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t('profile.overview.mentorship')}
                  value={userProfile.mentorshipRecord.mentorshipHistory.length}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <Text strong>{t('profile.overview.coursePreferences')}：</Text>
              <div style={{ marginTop: '8px' }}>
                {userProfile.coursePreferences.map(course => (
                  <Tag key={course} color="blue" style={{ marginBottom: '4px' }}>
                    {course}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* 右侧 - 学术成就与导师制记录 */}
        <Col xs={24} lg={16}>
          {/* 导师制传统 - 体现香港城市大学特色 */}
          <Card 
            title={
              <Space>
                <TeamOutlined />
                导师制传统 - 学术传承
              </Space>
            } 
            className="hover-lift"
            style={{ marginBottom: '24px' }}
          >
            <Alert
              message="香港城市大学导师制传统"
              description="我校秉承'敬业乐群'的校训，通过导师制度传承学术精神，培养学生的学术品格和研究能力。每位学生都有专属导师指导学术发展。"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="当前导师">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#1890ff' }}>
                      {userProfile.mentorshipRecord.currentMentor}
                    </Text>
                    <Text type="secondary">
                      指导领域：深度学习与计算机视觉
                    </Text>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card size="small" title="指导他人">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {userProfile.mentorshipRecord.mentoringOthers.map((record, index) => (
                      <div key={index}>
                        <Text strong>{record.mentee}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {record.focus} ({record.period})
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider />
            
            <Title level={4}>导师指导历程</Title>
            <Timeline>
              {userProfile.mentorshipRecord.mentorshipHistory.map((record, index) => (
                <Timeline.Item 
                  key={index}
                  dot={<TeamOutlined style={{ color: '#1890ff' }} />}
                >
                  <div>
                    <Text strong>{record.mentor}</Text>
                    <br />
                    <Text type="secondary">{record.focus}</Text>
                    <br />
                    <Text style={{ fontSize: '12px', color: '#999' }}>
                      {record.period}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {/* 学术成就 */}
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                学术成就记录
              </Space>
            }
            className="hover-lift"
          >
            <div className="stagger-fade-in">
              {userProfile.academicAchievements.map((achievement, index) => (
                <Card 
                  key={achievement.id}
                  size="small" 
                  style={{ marginBottom: '16px' }}
                  className="hover-lift"
                >
                  <Row align="middle">
                    <Col flex="auto">
                      <Space>
                        {getAchievementIcon(achievement.type)}
                        <div>
                          <Text strong>{achievement.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {achievement.description}
                          </Text>
                          {achievement.mentor && (
                            <>
                              <br />
                              <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                                指导导师：{achievement.mentor}
                              </Text>
                            </>
                          )}
                        </div>
                      </Space>
                    </Col>
                    <Col>
                      <Space direction="vertical" align="end">
                        <Tag color={getAchievementColor(achievement.type)}>
                          {achievement.type === 'award' ? '奖项' :
                           achievement.type === 'publication' ? '发表' :
                           achievement.type === 'project' ? '项目' : '竞赛'}
                        </Tag>
                        <Text style={{ fontSize: '12px', color: '#999' }}>
                          {dayjs(achievement.date).format('YYYY年MM月DD日')}
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
            
            <Button 
              type="dashed" 
              block 
              icon={<StarOutlined />}
              style={{ marginTop: '16px' }}
            >
              添加新成就
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 页面底部 - 大学信息 */}
      <Card style={{ marginTop: '24px', textAlign: 'center', background: '#f8f9fa' }}>
        <Text type="secondary">
          © 2024 香港城市大学 City University of Hong Kong | 
          <Button type="link" size="small" onClick={() => navigate('/')}>
            返回首页
          </Button> |
          <Button type="link" size="small" onClick={() => navigate('/settings')}>
            系统设置
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default Profile;